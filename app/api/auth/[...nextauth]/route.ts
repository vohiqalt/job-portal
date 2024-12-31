import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { email, password } = credentials || {};
          if (!email || !password) {
            throw new Error("Email and password are required.");
          }

          await dbConnect(); // Make sure we connect

          const user = await User.findOne({ email });
          if (!user) {
            throw new Error("Invalid email or password.");
          }

          if (!user.password) {
            throw new Error("User account does not have a password set.");
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            throw new Error("Invalid email or password.");
          }

          // Return an object that will become `user` in jwt()
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            userType: user.userType,
            bio: user.bio || "",
            location: user.location || "",
          };
        } catch (error) {
          console.error("Authorize Error:", error);
          if (error instanceof Error) {
            throw new Error(
              error.message || "An error occurred during authorization."
            );
          } else {
            throw new Error("An error occurred during authorization.");
          }
        }
      },
    }),
  ],
  callbacks: {
    async jwt({
      token,
      user,
      account,
    }: {
      token: any;
      user?: any;
      account?: any;
    }) {
      await dbConnect();

      // If user just logged in (or used credentials), update the token from the DB
      if (account && user) {
        // Attempt to find or create a matching user in the DB
        let existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          existingUser = await User.create({
            name: user.name,
            email: user.email,
            userType: "job_seeker", // Default type
            provider: account.provider,
          });
        }

        // Always keep token in sync with DB fields:
        token.id = existingUser._id.toString();
        token.email = existingUser.email; // IMPORTANT
        token.name = existingUser.name;
        token.userType = existingUser.userType;
        token.bio = existingUser.bio || "";
        token.location = existingUser.location || "";
      } else {
        // If it's an existing session, you might want to refresh from DB every time:
        const existingUser = await User.findOne({ email: token.email });
        if (existingUser) {
          token.id = existingUser._id.toString();
          token.email = existingUser.email;
          token.name = existingUser.name;
          token.userType = existingUser.userType;
          token.bio = existingUser.bio || "";
          token.location = existingUser.location || "";
        }
      }

      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      // Map token fields back to the session
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email, // Make sure `email` is set
        bio: token.bio || "",
        location: token.location || "",
        userType: token.userType || "job_seeker",
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
