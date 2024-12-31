import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Job from "@/models/Job";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { email } = session.user || {};
  if (!email) {
    return new Response(JSON.stringify({ error: "No email in session." }), {
      status: 400,
    });
  }

  await dbConnect();

  const jobCount = await Job.countDocuments({ employerId: session.user.id });
  return new Response(JSON.stringify({ jobCount }), {
    status: 200,
  });
}
