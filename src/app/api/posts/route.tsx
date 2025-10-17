import clientPromise from "@/lib/db";
import { Post } from "@/lib/types";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Parse query params
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("post_id"); // returns string | null

    let res;
    if (postId) {
      // fetch a single post by _id
      
        res = await db.collection("posts").findOne({"_id": new ObjectId(postId)});
    } else {
      // fetch all posts
        res = await db.collection("posts").find().toArray();
    }

    return NextResponse.json(res);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load Posts" },
      { status: 500 }
    );
  }
}
