import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "../../../lib/mongodb";
import Job from "../../../models/Job";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.userType !== "employer") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 403,
    });
  }

  await dbConnect();

  try {
    const { isHidden } = await req.json();
    const updatedJob = await Job.findOneAndUpdate(
      { _id: params.id, employerId: session.user.id },
      { isHidden },
      { new: true } // Return the updated document
    );

    if (!updatedJob) {
      return new Response(
        JSON.stringify({ error: "Job not found or unauthorized" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(updatedJob), { status: 200 });
  } catch (error) {
    console.error("Error updating job visibility:", error);

    return new Response(
      JSON.stringify({ error: "Failed to update job visibility" }),
      { status: 500 }
    );
  }
}
