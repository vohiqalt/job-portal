"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { FaMapMarkerAlt } from "react-icons/fa";
import Image from "next/image";
import { TbMoneybag } from "react-icons/tb";

type Job = {
  _id: string;
  title: string;
  location: string;
  description: string;
  salary?: number;
  employerId: {
    companyName: string;
    companyLogo: string;
  };
  tags: string[];
};

export default function JobDetails() {
  const [job, setJob] = useState<Job | null>(null);
  const params = useParams();

  useEffect(() => {
    async function fetchJobDetails() {
      if (!params.id) {
        console.error("Job ID is missing");
        notFound();
        return;
      }

      try {
        const res = await fetch(`/api/job?id=${params.id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          notFound();
          return;
        }

        const data = await res.json();
        setJob(data);
      } catch (err) {
        console.error("Error fetching job details:", err);
        notFound();
      }
    }

    fetchJobDetails();
  }, [params.id]);

  if (!job) return null;

  return (
    <main className="p-6 bg-gray-900 text-white border border-gray-700 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        {/* Left Section: Job Title, Employer, and Logo */}
        <div className="flex items-center gap-4">
          {job.employerId.companyLogo && (
            <Image
              src={job.employerId.companyLogo}
              alt={`${job.employerId.companyName} logo`}
              width={100}
              height={100}
              className="rounded-md"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold">{job.title}</h1>
            <p className="text-lg text-gray-400 mb-2">
              {job.employerId.companyName}
            </p>
            <p className="text-gray-300 mb-2 flex items-center">
              <FaMapMarkerAlt className="mr-2" />
              {job.location}
            </p>
          </div>
        </div>
        {/* Right Section: Salary */}
        <div className="text-right">
          {job.salary ? (
            <p className="text-yellow-400 font-semibold text-xl flex items-center justify-end">
              <TbMoneybag className="mr-2" />
              {`${job.salary.toLocaleString()} PLN`}
            </p>
          ) : (
            <p className="text-gray-400">Undisclosed salary</p>
          )}
        </div>
      </div>
      {/* Job Description */}
      <p className="text-gray-200">{job.description}</p>
    </main>
  );
}
