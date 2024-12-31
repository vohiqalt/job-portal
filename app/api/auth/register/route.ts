import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "../../../../lib/mongodb";
import User from "../../../../models/User";

export async function POST(req: Request) {
  const { name, email, password, userType } = await req.json();

  if (!name || !email || !password || !userType) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  await dbConnect();

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create a new user
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    userType,
  });

  await newUser.save();

  return NextResponse.json({ message: "User registered successfully!" });
}
