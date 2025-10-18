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

    if (!commentId) {
      return NextResponse.json(
        { error: "Missing comment_id" },
        { status: 400 }
      );
    }

    const comment = await db
      .collection("comments")
      .findOne({ _id: new ObjectId(commentId) });

    if (!comment || !comment.comment_replies_ids) {
      // Always return NextResponse
      return NextResponse.json([]);
    }

    const replies_: Comment[] = [];

    for (let i = 0; i < comment.comment_replies_ids.length; i++) {
      const reply_id = comment.comment_replies_ids[i];
      const obj = await db
        .collection("comments")
        .findOne({ _id: new ObjectId(reply_id) });

      if (obj) replies_.push(obj as unknown as Comment);
    }

    return NextResponse.json(replies_);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to load replies" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  try {
    const data = await request.json();

    const inserted_ = await db.collection("comments").insertOne(data);

    if (inserted_.acknowledged && data.parent_comment_id) {
      await db
        .collection("comments")
        .updateOne(
          { _id: new ObjectId(data.parent_comment_id) },
          { $push: { comment_replies_ids: inserted_.insertedId } } as any
        );
    }

    return NextResponse.json(
      { message: "Data received successfully!", inserted: inserted_ },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to insert comment" },
      { status: 500 }
    );
  }
}
