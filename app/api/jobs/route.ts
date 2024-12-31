import { NextResponse } from "next/server";

// In-memory mock database (replace with a real database later)
let jobs = [
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

export async function GET() {
  return NextResponse.json(jobs);
}

export async function POST(req: Request) {
  const body = await req.json();

  const newJob = {
    id: jobs.length + 1, // Generate a simple ID (replace with DB auto-generated ID later)
    ...body,
  };

  jobs.push(newJob);

  return NextResponse.json(newJob, { status: 201 });
}
