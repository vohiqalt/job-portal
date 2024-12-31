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
      return NextResponse.json({ error: "No email found" }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (user.userType !== "employer") {
      return NextResponse.json(
        { error: "Not an employer account." },
        { status: 403 }
      );
    }

    // Return employer fields
    return NextResponse.json({
      companyLogo: user.companyLogo,
      companyName: user.companyName,
      companyDescription: user.companyDescription,
      howWeWork: user.howWeWork,
      // Add more if needed
    });
  } catch (error) {
    console.error("Error fetching company profile:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
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
        { error: "No email in session" },
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
        { error: "Not an employer account." },
        { status: 403 }
      );
    }

    const data = await req.json();
    user.companyLogo = data.companyLogo || "";
    user.companyName = data.companyName || user.companyName;
    user.companyDescription = data.companyDescription || "";
    user.howWeWork = data.howWeWork || "";

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
