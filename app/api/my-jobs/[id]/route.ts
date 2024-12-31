import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "../../../../lib/mongodb";
import Job from "../../../../models/Job";

// DELETE a Job Offer
export async function DELETE(
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
    const { id } = params;
    console.log("Deleting job with ID:", id);

    const deletedJob = await Job.deleteOne({
      _id: id,
      employerId: session.user.id,
    });

    if (deletedJob.deletedCount === 0) {
      return new Response(
        JSON.stringify({ error: "Job not found or unauthorized" }),
        { status: 404 }
      );
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting job:", error);
    return new Response(JSON.stringify({ error: "Failed to delete job" }), {
      status: 500,
    });
  }
}

// PATCH a Job Offer (Toggle Visibility)
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

    console.log("Updated Job in Backend:", updatedJob);

    return new Response(JSON.stringify(updatedJob), { status: 200 });
  } catch (error) {
    console.error("Error updating job visibility:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update job visibility" }),
      { status: 500 }
    );
  }
}
