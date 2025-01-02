import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Job from "@/models/Job";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    await dbConnect();

    // Fetch all jobs and include the companyLogo field from the employerId
    const jobs = await Job.find({})
      .populate("employerId", "companyName companyLogo")
      .lean();

    return new Response(JSON.stringify(jobs), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { email, id: employerId } = session.user;

    await dbConnect();

    let body;
    try {
      body = await req.json();
    } catch (err) {
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { title, location, salary, tags, description } = body;

    // Validate required fields
    if (!title || !location || !description) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Prepare the location string and flag
    let locationString = "";
    let flagUrl = null;

    if (typeof location === "object" && location.city && location.country) {
      locationString = `${location.city}, ${location.country}`;
      flagUrl = location.flag || null;
    } else {
      locationString = location; // Handle as string if no object provided
    }

    // Create the job
    const job = await Job.create({
      title,
      location: locationString, // Save the formatted location string
      salary: salary ? parseInt(salary, 10) : undefined,
      tags: tags || [],
      description,
      employerId,
      userEmail: email,
      flag: flagUrl, // Save the flag URL in the database
    });

    return new Response(
      JSON.stringify({ message: "Job created successfully", job }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating job:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
