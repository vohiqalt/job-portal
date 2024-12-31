"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 bg-blue-600 text-white flex justify-between items-center">
        <h1 className="text-xl font-bold">Job Portal</h1>
        <nav className="flex gap-4">
          <Link
            href="/"
            className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-700"
          >
            Home
          </Link>
          <Link
            href="/jobs"
            className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-700"
          >
            Jobs
          </Link>
          {!session && (
            <Link
              href="/register"
              className="px-4 py-2 rounded bg-green-500 hover:bg-green-700"
            >
              Register
            </Link>
          )}
          {session?.user?.userType === "employer" && (
            <>
              <Link
                href="/jobs/create"
                className="px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-700"
              >
                Post a Job
              </Link>
              <Link
                href="/my-jobs"
                className="px-4 py-2 rounded bg-purple-500 hover:bg-purple-700"
              >
                My Job Offers
              </Link>
            </>
          )}
          {session ? (
            <>
              <span>Welcome, {session.user.name}!</span>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 rounded bg-red-500 hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn()}
              className="px-4 py-2 rounded bg-green-500 hover:bg-green-700"
            >
              Login
            </button>
          )}
        </nav>
      </header>
      <main className="flex-grow">{children}</main>
      <footer className="p-4 bg-gray-800 text-center text-white">
        © {new Date().getFullYear()} Job Portal
      </footer>
    </div>
  );
}
