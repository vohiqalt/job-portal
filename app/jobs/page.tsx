"use client";

import { useEffect, useState } from "react";

type Job = {
  _id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: number;
  isHidden: boolean;
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch("/api/jobs", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const error = await res.json();
          setError(error.error || "Failed to fetch jobs");
          return;
        }

        const data: Job[] = await res.json();
        const visibleJobs = data.filter((job) => !job.isHidden);
        setJobs(visibleJobs);
      } catch (err) {
        console.error("Error during fetch:", err);
        setError("An unexpected error occurred.");
      }
    }

    fetchJobs();
  }, []);

  if (error) {
    return (
      <div className="p-6 text-red-500">
        <h1 className="text-2xl font-bold">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Job Listings</h1>
      {jobs.length > 0 ? (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li key={job._id} className="p-4 border rounded shadow">
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p className="text-gray-300">{job.company}</p>
              <p className="text-gray-200">{job.location}</p>
              <p className="text-gray-500">{job.description}</p>
              {job.salary && (
                <p className="text-gray-300 font-medium">
                  Salary: ${job.salary}
                </p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No jobs found.</p>
      )}
    </div>
  );
}
