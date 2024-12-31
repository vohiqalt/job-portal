import dbConnect from "@/lib/mongodb";

export async function GET() {
  try {
    await dbConnect();
    return new Response("Database connected successfully!", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Database connection failed!", { status: 500 });
  }
}
