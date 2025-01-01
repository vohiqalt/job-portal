"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateJobPage() {
  const [form, setForm] = useState({
    title: "",
    location: "",
    salary: "",
    tags: "",
    description: "",
  });

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Split tags into an array
    const tagsArray = form.tags.split(",").map((tag) => tag.trim());

    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...form, tags: tagsArray }),
    });

    if (res.ok) {
      router.push("/jobs"); // Redirect to jobs page after successful creation
    } else {
      console.error("Failed to create job");
    }
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create Job Listing</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium mb-1">Job Title:</label>
          <input
            type="text"
            placeholder="Job Title"
            className="w-full p-2 border border-gray-300 rounded text-black"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location:</label>
          <input
            type="text"
            placeholder="Location"
            className="w-full p-2 border border-gray-300 rounded text-black"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Salary:</label>
          <input
            type="text"
            placeholder="Salary"
            className="w-full p-2 border border-gray-300 rounded text-black"
            value={form.salary}
            onChange={(e) => setForm({ ...form, salary: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tags:</label>
          <input
            type="text"
            placeholder="Tags (comma-separated)"
            className="w-full p-2 border border-gray-300 rounded text-black"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Job Description:
          </label>
          <textarea
            placeholder="Job Description"
            className="w-full p-2 border border-gray-300 rounded text-black"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create Job
        </button>
      </form>
    </main>
  );
}
