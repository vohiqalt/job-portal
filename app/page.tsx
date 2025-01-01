"use client";

import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const userType = session?.user?.userType;

  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-gray-700 rounded-lg">
      {/* Features Specific to Job Seekers */}
      {userType === "job_seeker" && (
        <div className="mt-12 w-full max-w-4xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FeatureCard
              title="Browse Job Listings"
              description="Explore a wide range of opportunities tailored to your skills and preferences."
              link="/jobs"
            />
            <FeatureCard
              title="Your Profile"
              description="Showcase your skills, experience, and achievements to potential employers."
              link="/account/candidate/profile"
            />
            <FeatureCard
              title="Saved Jobs"
              description="Keep track of job opportunities that catch your interest."
              link="/jobs/saved"
            />
            <FeatureCard
              title="My applicatons"
              description="Keep track of job applications that you have submitted."
              link="/my-applications"
            />
          </div>
        </div>
      )}

      {/* Features Specific to Employers */}
      {userType === "employer" && (
        <div className="mt-12 w-full max-w-4xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FeatureCard
              title="Browse Job Listings"
              description="See how other companies are attracting top talent to their organizations."
              link="/jobs"
            />
            <FeatureCard
              title="Company Profile"
              description="Update your company profile and showcase your brand to potential candidates."
              link="/account/company/profile"
            />
            <FeatureCard
              title="Post a Job"
              description="Create job listings to attract top talent to your organization."
              link="/jobs/post"
            />
            <FeatureCard
              title="Manage Applications"
              description="Track and review job applications from potential candidates."
              link="/applications"
            />
          </div>
        </div>
      )}

      {/* Call to Action for Unauthenticated Users */}
      {!session && (
        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">
            Create an account to unlock more features.
          </p>
          <a
            href="/auth/register"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Get Started
          </a>
        </div>
      )}
    </main>
  );
}

function FeatureCard({
  title,
  description,
  link,
}: {
  title: string;
  description: string;
  link: string;
}) {
  return (
    <a
      href={link}
      className="block bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-900 transition"
    >
      <h3 className="text-xl font-semibold text-gray-200 mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </a>
  );
}
