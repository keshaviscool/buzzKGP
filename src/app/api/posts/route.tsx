import clientPromise from "@/lib/db";
import { Post } from "@/lib/types";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("buzzKGP");

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("post_id"); 
    const user_id = searchParams.get("user_id");

    let res;
    if (postId) {
        res = await db.collection("posts").findOne({"_id": new ObjectId(postId)});
    } 
    if (user_id) {
        res = (await db.collection("posts").find({
          user_id: user_id
        }).toArray()).reverse();
        
      
    }
    if (!postId && !user_id) {
      // fetch all posts
        res = (await db.collection("posts").find({}).toArray()).reverse();
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
