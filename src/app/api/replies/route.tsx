import clientPromise from "@/lib/db";
import { Comment } from "@/lib/types";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";



export async function GET(request: Request) {

const client = await clientPromise;
const db = client.db(process.env.MONGODB_DB);
  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get("comment_id");

    const comment = await  db.collection("comments").findOne({  _id: new ObjectId(commentId) });

    const replies_: Comment[] = [];
    if (!comment) return replies_;
    if (!comment.comment_replies_ids) return replies_;

    for (let i = 0; i < comment?.comment_replies_ids.length; i++) {
        const reply_id = comment?.comment_replies_ids[i];
        const obj = await db.collection("comments").findOne({ _id: new ObjectId(reply_id) });
        
        replies_.push(obj)
    }
    
    return NextResponse.json(replies_);
}
catch{

    return NextResponse.json(
      { error: "Failed to load replies" },
      { status: 500 }
    );
  }
}

export async function POST(request:Request) {
    const client = await clientPromise;
const db = client.db(process.env.MONGODB_DB);
    const data = await request.json(); // Parses the request body as JSON
    // Now 'data' contains the JSON object sent by the client

    // Process the data, e.g., save to a database, perform calculations
    const inserted_ = await db.collection("comments").insertOne(data)

    if (inserted_.acknowledged) {
        await db.collection("comments").updateOne({_id: new ObjectId(data.parent_comment_id)}, { $push: { comment_replies_ids: inserted_.insertedId }})
    }
    // Send a response back to the client
    return NextResponse.json({ message: 'Data received successfully!', inserted: inserted_ }, { status: 200 });
}