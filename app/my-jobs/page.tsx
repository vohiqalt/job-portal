"use client";

import { useEffect, useState } from "react";

type Job = {
  _id: string;
  title: string;
  company: string;
  location: string;
  salary?: number;
  description: string;
  isHidden: boolean;
};

export default function MyJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    async function fetchMyJobs() {
      const res = await fetch("/api/my-jobs");
      if (res.ok) {
        const data: Job[] = await res.json();
        setJobs(data);
      } else {
        console.error("Failed to fetch jobs");
      }
    }

    fetchMyJobs();
  }, []);

  async function deleteJob(id: string) {
    const res = await fetch(`/api/my-jobs/${id}`, { method: "DELETE" });
    if (res.ok) {
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== id));
    } else {
      console.error("Failed to delete job");
    }
  }

  async function toggleJobVisibility(id: string, isHidden: boolean) {
    const res = await fetch(`/api/my-jobs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isHidden: !isHidden }),
    });
    if (res.ok) {
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job._id === id ? { ...job, isHidden: !isHidden } : job
        )
      );
    } else {
      console.error("Failed to toggle job visibility");
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Job Offers</h1>
      {jobs.length > 0 ? (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li key={job._id} className="p-4 border rounded shadow">
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p className="text-gray-600">{job.company}</p>
              <p className="text-gray-500">{job.location}</p>
              {job.salary && (
                <p className="text-gray-700 font-medium">
                  Salary: ${job.salary}
                </p>
              )}
              <p className="text-gray-800">{job.description}</p>
              <p
                className={`text-sm ${
                  job.isHidden ? "text-red-600" : "text-green-600"
                }`}
              >
                {job.isHidden ? "Hidden" : "Visible"}
              </p>
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => toggleJobVisibility(job._id, job.isHidden)}
                  className={`px-4 py-2 rounded ${
                    job.isHidden ? "bg-green-600" : "bg-yellow-600"
                  } text-white`}
                >
                  {job.isHidden ? "Unhide" : "Hide"}
                </button>
                <button
                  onClick={() => deleteJob(job._id)}
                  className="px-4 py-2 rounded bg-red-600 text-white"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No job offers found.</p>
      )}
    </div>
  );
}
