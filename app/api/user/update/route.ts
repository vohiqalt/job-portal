import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust the path as needed
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function PUT(req: Request) {
  // Validate session
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  // Parse and validate the request body
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

  // Ensure userType is valid
  if (!["job_seeker", "employer"].includes(userType)) {
    return new Response(
      JSON.stringify({ error: "Invalid account type provided" }),
      { status: 400 }
    );
  }

  const { email } = session.user;

  await dbConnect();

  try {
    // Update the user account type
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { userType }, // Update the `userType` field
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({
        message: `Account type updated to ${userType} successfully.`,
        user: {
          email: updatedUser.email,
          userType: updatedUser.userType,
        },
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
