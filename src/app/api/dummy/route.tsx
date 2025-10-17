import { NextResponse } from "next/server";
import { seedDummyComments, seedDummyPosts } from "@/lib/helper";

export async function GET() {
  try {
    await seedDummyComments();
    return NextResponse.json({ message: "Dummy posts inserted successfully!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to insert dummy posts" }, { status: 500 });
  }
}
