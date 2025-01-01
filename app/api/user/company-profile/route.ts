import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

// GET /api/user/company-profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = session.user?.email;
    if (!email) {
      return NextResponse.json(
        { error: "No email found in session" },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.userType !== "employer") {
      return NextResponse.json(
        { error: "Access denied: Not an employer account" },
        { status: 403 }
      );
    }

    // Return employer-specific fields
    return NextResponse.json({
      companyLogo: user.companyLogo || "",
      companyName: user.companyName || "",
      companyDescription: user.companyDescription || "",
      howWeWork: user.howWeWork || "",
    });
  } catch (error) {
    console.error("Error fetching company profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT /api/user/company-profile
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = session.user?.email;
    if (!email) {
      return NextResponse.json(
        { error: "No email found in session" },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.userType !== "employer") {
      return NextResponse.json(
        { error: "Access denied: Not an employer account" },
        { status: 403 }
      );
    }

    const data = await req.json();

    // Update only the fields that are provided in the request body
    if (data.companyLogo !== undefined) user.companyLogo = data.companyLogo;
    if (data.companyName !== undefined) user.companyName = data.companyName;
    if (data.companyDescription !== undefined)
      user.companyDescription = data.companyDescription;
    if (data.howWeWork !== undefined) user.howWeWork = data.howWeWork;

    await user.save();

    return NextResponse.json({
      message: "Company profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating company profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
