"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaMapMarkerAlt, FaRegBuilding } from "react-icons/fa";
import { TbMoneybag } from "react-icons/tb";
import Image from "next/image";

type Job = {
  _id: string;
  title: string;
  location: string;
  flag: string | null;
  currency?: string;
  description: string;
  salary?: number;
  isHidden: boolean;
  employerId: {
    companyName: string;
    companyLogo?: string;
  };
  tags: string[];
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
    <div className="p-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Job Listings</h1>
      {jobs.length > 0 ? (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li
              key={job._id}
              onClick={() => router.push(`/jobs/${job._id}`)}
              className="p-4 border border-gray-700 rounded-lg shadow-md bg-gray-800 cursor-pointer hover:bg-gray-700 transition flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                {/* Company Logo */}
                {job.employerId.companyLogo && (
                  <Image
                    src={job.employerId.companyLogo}
                    alt={`${job.employerId.companyName} logo`}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                )}
                {/* Job Info */}
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {job.title}
                  </h2>

                  <div className="flex items-center text-gray-400 text-sm mt-2">
                    <FaRegBuilding className="mr-1" />
                    <p>{job.employerId.companyName}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {job.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-900 text-blue-300 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center text-gray-400 text-sm mt-2">
                    <FaMapMarkerAlt className="mr-1" />
                    <p>{job.location}</p>
                    {job.flag && (
                      <Image
                        src={job.flag}
                        width={20}
                        height={20}
                        alt={`Flag of ${job.location}`}
                        className="ml-2"
                      />
                    )}
                  </div>
                </div>
              </div>
              {/* Salary Info */}
              <div className="text-right">
                {job.salary ? (
                  <div className="flex items-center justify-end text-yellow-400 font-medium text-lg">
                    <TbMoneybag className="mr-1" />
                    <p>{`${job.salary.toLocaleString()} ${
                      job.currency || ""
                    }`}</p>
                  </div>
                ) : (
                  <p className="text-gray-400">Undisclosed salary</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No jobs found.</p>
      )}
    </div>
  );
}
