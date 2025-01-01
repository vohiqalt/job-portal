import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function PUT(req: Request) {
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

    let body;
    try {
      body = await req.json();
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Invalid or empty JSON body" }),
        { status: 400 }
      );
    }

    // Prevent attempts to update user type or email
    if (body.userType || body.email) {
      return new Response(
        JSON.stringify({ error: "Updating user type or email is not allowed" }),
        { status: 403 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    // Update other profile fields
    Object.keys(body).forEach((key) => {
      user[key] = body[key];
    });

    await user.save();

    return new Response(
      JSON.stringify({ message: "Profile updated successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user profile:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
