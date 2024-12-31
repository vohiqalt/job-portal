import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Job from "@/models/Job";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  let body;
  try {
    body = await req.json();
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Invalid or empty JSON body" }),
      { status: 400 }
    );
  }

  const { userType } = body;
  if (!["job_seeker", "employer"].includes(userType)) {
    return new Response(
      JSON.stringify({ error: "Invalid account type provided" }),
      { status: 400 }
    );
  }

  const { email } = session.user;
  if (!email) {
    return new Response(JSON.stringify({ error: "No email in session." }), {
      status: 400,
    });
  }

  await dbConnect();

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    // If switching from employer -> job_seeker, delete jobs
    if (existingUser.userType === "employer" && userType === "job_seeker") {
      await Job.deleteMany({ userEmail: email });
    }

    // Update user type
    existingUser.userType = userType;
    await existingUser.save();

    return new Response(
      JSON.stringify({
        message: `Account type updated to ${userType} successfully.`,
        user: {
          email: existingUser.email,
          userType: existingUser.userType,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
