import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "../../../lib/mongodb";
import Job from "../../../models/Job";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.userType !== "employer") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 403,
    });
  }

  await dbConnect();

  try {
    const jobs = await Job.find({ employerId: session.user.id });
    return new Response(JSON.stringify(jobs), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch jobs" }), {
      status: 500,
    });
  }
}
