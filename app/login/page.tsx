"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false, // Avoid redirect by NextAuth to handle it manually
    });

    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/jobs"); // Redirect to jobs page after login
    }
  }

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-600 rounded-lg">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <form
        className="space-y-4 w-full max-w-md p-4 bg-black shadow-md rounded"
        onSubmit={handleSubmit}
      >
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border border-gray-300 rounded bg-gray-200 text-center"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border border-gray-300 rounded bg-gray-200 text-center"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Login with Email
        </button>
      </form>
      <div className="mt-4">
        <button
          onClick={() => signIn("google", { callbackUrl: "/jobs" })}
          className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-700"
        >
          Login with Google
        </button>
      </div>
    </main>
  );
}
