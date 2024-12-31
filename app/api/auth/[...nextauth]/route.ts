import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "../../../../lib/mongodb";
import User from "../../../../models/User";
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

          await dbConnect();

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

          // Return the user object including additional fields
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            bio: user.bio || "",
            location: user.location || "",
            userType: user.userType,
          };
        } catch (error) {
          if (error instanceof Error) {
            console.error("Authorize Error:", error.message);
            throw new Error(
              error.message || "An error occurred during authorization."
            );
          } else {
            console.error("Authorize Error:", error);
            throw new Error("An error occurred during authorization.");
          }
        }
      },
    }),
  ],
  callbacks: {
    async jwt({
      token,
      account,
      user,
    }: {
      token: any;
      account: any;
      user?: any;
    }) {
      await dbConnect();

      // If this is the first time the user signs in
      if (account && user) {
        let existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          // If the user doesn't exist, create a new one
          existingUser = await User.create({
            name: user.name,
            email: user.email,
            userType: "job_seeker", // Default userType
            provider: account.provider,
          });
        }

        // Attach user information to the token
        token.id = existingUser._id.toString();
        token.userType = existingUser.userType;
        token.bio = existingUser.bio || "";
        token.location = existingUser.location || "";
      }

      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
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
