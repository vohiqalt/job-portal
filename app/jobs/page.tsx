"use client";

import { useEffect, useState } from "react";

type Job = {
  _id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: number; // Include salary as an optional field
  isHidden: boolean; // Add a property to track if the job is hidden
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    async function fetchJobs() {
      const res = await fetch("/api/jobs");
      if (res.ok) {
        const data: Job[] = await res.json(); // Ensure the response is typed
        // Filter out hidden jobs before setting state
        const visibleJobs = data.filter((job) => !job.isHidden);
        setJobs(visibleJobs);
      } else {
        console.error("Failed to fetch jobs");
      }
    }

    fetchJobs();
  }, []);

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
