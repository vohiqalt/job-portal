import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name?: string;
    companyName?: string;
    companyDescription?: string;
    email: string;
    image?: string;
    bio?: string;
    location?: string;
    userType?: string;
  }

  interface Session {
    user: User;
  }
}
