"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    userType: "job_seeker", // Default user type
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        router.push("/login"); // Redirect to login page
      }, 2000);
    } else {
      const errorData = await res.json();
      setError(errorData.error || "Something went wrong.");
    }
  }

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">Register</h1>
      <form
        className="space-y-4 w-full max-w-md p-4 bg-white shadow-md rounded"
        onSubmit={handleSubmit}
      >
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-2 border border-gray-300 rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border border-gray-300 rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border border-gray-300 rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <select
          className="w-full p-2 border border-gray-300 rounded"
          value={form.userType}
          onChange={(e) => setForm({ ...form, userType: e.target.value })}
          required
        >
          <option value="job_seeker">Job Seeker</option>
          <option value="employer">Employer</option>
        </select>
        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Register
        </button>
      </form>
    </main>
  );
}
