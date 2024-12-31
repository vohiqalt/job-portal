"use client";

import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 bg-blue-600 text-white flex justify-between items-center">
        <h1 className="text-xl font-bold">Job Portal</h1>
        <nav>
          <Link href="/jobs" className="px-4 py-2 rounded bg-green-500">
            Jobs
          </Link>
        </nav>
      </header>
      <main className="flex-grow">{children}</main>
      <footer className="p-4 bg-gray-800 text-center text-white">
        © {new Date().getFullYear()} Job Portal
      </footer>
    </div>
  );
}
