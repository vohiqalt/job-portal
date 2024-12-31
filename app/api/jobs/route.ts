import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "../../../lib/mongodb";
import Job from "../../../models/Job";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.userType !== "employer") {
    return new Response(JSON.stringify({ error: "Unauthorized access" }), {
      status: 403,
    });
  }

  await dbConnect();

  try {
    const jobData = await req.json();

    const newJob = await Job.create({
      ...jobData,
      employerId: session.user.id,
    });

    return new Response(JSON.stringify(newJob), { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to create job",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  await dbConnect();

  try {
    // Fetch all jobs from the database
    const jobs = await Job.find({});
    return new Response(JSON.stringify(jobs), { status: 200 });
  } catch (error) {
    console.error("Error fetching jobs:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to fetch jobs",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500 }
    );
  }
}
