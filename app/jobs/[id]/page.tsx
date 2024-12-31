import { notFound } from "next/navigation";

type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  tags: string[];
  description: string;
};

// Mock job data (replace with API call later)
const jobs: Job[] = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechCorp",
    location: "Remote",
    salary: "$50k–$70k",
    tags: ["React", "Remote", "Full-time"],
    description:
      "We are looking for a skilled frontend developer to join our team.",
  },
  {
    id: 2,
    title: "Backend Engineer",
    company: "DevHub",
    location: "On-site",
    salary: "$70k–$90k",
    tags: ["Node.js", "MongoDB", "Full-time"],
    description: "Join us as a backend engineer to build scalable APIs.",
  },
];

export default function JobDetails({ params }: { params: { id: string } }) {
  const job = jobs.find((job) => job.id === parseInt(params.id));

  if (!job) {
    notFound(); // Show a 404 if the job isn't found
  }

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
      <p className="text-lg text-gray-600 mb-2">{job.company}</p>
      <p className="text-gray-600 mb-2">{job.location}</p>
      <p className="text-gray-600 mb-4">{job.salary}</p>
      <ul className="flex flex-wrap gap-2 mb-4">
        {job.tags.map((tag, idx) => (
          <li
            key={idx}
            className="px-2 py-1 text-sm font-medium text-white bg-blue-500 rounded"
          >
            {tag}
          </li>
        ))}
      </ul>
      <p className="text-gray-800">{job.description}</p>
    </main>
  );
}
