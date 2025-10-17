import clientPromise from "@/lib/db";
import { Post, Comment } from "@/lib/types";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";



export async function GET(request: Request) {

    const client = await clientPromise;
const db = client.db(process.env.MONGODB_DB);
  try {
    

    // Parse query params
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("post_id"); // returns string | null

    const comments = await db.collection("comments").find({ "post_id": postId, "reply_to": "post" }).toArray();
    
    return NextResponse.json(comments);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load Posts" },
      { status: 500 }
    );
  }
}
