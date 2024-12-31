"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    userType: "job_seeker",
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Handle registration logic here
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      // Redirect to jobs page after successful registration
      router.push("/jobs");
    } else {
      const data = await res.json();
      setError(data.error || "Failed to register");
    }
  }

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-600 rounded-lg">
      <h1 className="text-3xl font-bold mb-4">Register</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 w-full max-w-md p-4 bg-black shadow-md rounded"
      >
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border border-gray-300 rounded bg-gray-200 text-center text-black"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border border-gray-300 rounded bg-gray-200 text-center text-black"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border border-gray-300 rounded bg-gray-200 text-center text-black"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <select
          className="w-full p-2 border border-gray-300 rounded bg-gray-200 text-center text-black"
          value={form.userType}
          onChange={(e) => setForm({ ...form, userType: e.target.value })}
          required
        >
          <option value="job_seeker">I'm looking for a job</option>
          <option value="employer">I'm hiring</option>
        </select>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Register
        </button>
      </form>
      <div className="mt-4">
        <button
          onClick={() => signIn("google", { callbackUrl: "/jobs" })}
          className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-700"
        >
          Register with Google
        </button>
      </div>
    </main>
  );
}
