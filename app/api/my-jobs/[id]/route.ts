import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "../../../../lib/mongodb";
import Job from "../../../../models/Job";

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
    await Job.deleteOne({ _id: params.id, employerId: session.user.id });
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to delete job" }), {
      status: 500,
    });
  }
}

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
      { new: true }
    );

    return new Response(JSON.stringify(updatedJob), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to update job visibility" }),
      { status: 500 }
    );
  }
}
