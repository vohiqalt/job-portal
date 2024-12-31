"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  tags: string[];
  description: string;
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    async function fetchJobs(): Promise<Job[]> {
      const res = await fetch("/api/jobs");
      return res.json();
    }
    fetchJobs().then(setJobs).catch(console.error);
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Job Listings</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <Link href={`/jobs/${job.id}`} key={job.id}>
            <div className="p-4 border border-gray-200 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p className="text-gray-600">{job.company}</p>
              <p className="text-gray-600">{job.location}</p>
              <p className="mt-2 text-sm text-gray-500">{job.salary}</p>
              <ul className="flex flex-wrap gap-2 mt-2">
                {job.tags.map((tag, idx) => (
                  <li
                    key={idx}
                    className="px-2 py-1 text-xs font-medium text-white bg-blue-500 rounded"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
