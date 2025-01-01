import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

// GET /api/user/profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;
    if (!userEmail) {
      return NextResponse.json(
        { error: "No email in session" },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return only the fields you want to expose
    if (user.userType === "job_seeker") {
      return NextResponse.json({
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
        phoneNumber: user.phoneNumber,
        personalWebsite: user.personalWebsite,
        linkedIn: user.linkedIn,
        github: user.github,
        twitter: user.twitter,
        cv: user.cv,
        workExperience: user.workExperience,
        education: user.education,
        certificates: user.certificates,
        skills: user.skills,
        languages: user.languages,
        hobbies: user.hobbies,
        location: user.location,
        bio: user.bio,
        provider: user.provider,
      });
    }

    // If employer
    if (user.userType === "employer") {
      return NextResponse.json({
        name: user.name,
        email: user.email,
        companyLogo: user.companyLogo,
        companyName: user.companyName,
        companyDescription: user.companyDescription,
        howWeWork: user.howWeWork,
        location: user.location,
        bio: user.bio,
      });
    }

    // If somehow neither type was set
    return NextResponse.json({ error: "Invalid userType" }, { status: 400 });
  } catch (error) {
    console.error("Error getting profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/user/profile
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;
    if (!userEmail) {
      return NextResponse.json(
        { error: "No email in session" },
        { status: 400 }
      );
    }

    const body = await req.json();

    await dbConnect();

    const user = await User.findOneAndUpdate(
      { email: userEmail },
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
