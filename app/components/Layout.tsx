"use client";

import Navbar from "./Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <header className="p-4 bg-gradient-to-r from-gray-600 to-gray-800 text-white flex justify-between items-center">
        <Navbar />
      </header>
      <main className="flex-grow bg-gray-800">
        <div className="max-w-screen-xl mx-auto px-4 py-8">{children}</div>
      </main>
      <footer className="p-4 bg-gradient-to-r from-gray-600 to-gray-800 text-center text-white rounded-t-lg shadow-inner">
        © {new Date().getFullYear()} Job Portal
      </footer>
    </div>
  );
}
