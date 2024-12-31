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
        const { email, password } = credentials || {};
        if (!email || !password) {
          throw new Error("Email and password are required.");
        }

        await dbConnect();
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("Invalid email or password.");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid email or password.");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          userType: user.userType,
        };
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
      // If this is the first time the user signs in
      if (account && user) {
        await dbConnect();

        // Find the user in the database
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

        token.id = existingUser._id.toString(); // Add the MongoDB `_id` to the token
        token.userType = existingUser.userType; // Add userType to the token
      }

      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.id; // Add the user ID to the session
      session.user.userType = token.userType; // Add the userType to the session
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
