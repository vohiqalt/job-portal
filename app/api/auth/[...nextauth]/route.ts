import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "../../../../lib/mongodb";
import User from "../../../../models/User";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
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
