import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Job from "@/models/Job";

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const { email } = session.user;
    if (!email) {
      return new Response(JSON.stringify({ error: "No email in session." }), {
        status: 400,
      });
    }

    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    // If the user is an employer, delete all associated jobs
    if (user.userType === "employer") {
      await Job.deleteMany({ employerId: user._id });
    }

    // Delete the user
    await User.findOneAndDelete({ email });

    return new Response(
      JSON.stringify({
        message: "Account and associated jobs deleted successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting account:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
