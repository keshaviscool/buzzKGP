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



export async function POST(request: Request) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  const data = await request.json(); // Parses the request body as JSON
  // Now 'data' contains the JSON object sent by the client

  // Process the data, e.g., save to a database, perform calculations
  const inserted_ = await db.collection("comments").insertOne(data)

  // Send a response back to the client
  return NextResponse.json({ message: 'Data received successfully!', inserted: inserted_ }, { status: 200 });
}
