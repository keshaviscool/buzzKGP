import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  const client = await clientPromise;
    const db = client.db("buzzKGP");

  const { searchParams } = new URL(request.url);
  const reaction = searchParams.get("reaction"); // "upvote" or "downvote"
  const user_id = searchParams.get("user_id");
  const type = searchParams.get("type"); // "post" or "comment"
  const content_id = searchParams.get("content_id");

  if (!reaction || !user_id || !type || !content_id) {
    return new Response("Missing required parameters", { status: 400 });
  }

  const collection = type === "post" ? "posts" : "comments";

  // Fetch current post/comment
  const doc = await db.collection(collection).findOne({ _id: new ObjectId(content_id) });
  if (!doc) return new Response("Content not found", { status: 404 });

  const hasUpvoted = doc.upvotes_user_id.includes(user_id);
  const hasDownvoted = doc.downvotes_user_id.includes(user_id);

  let update = {};

  if (reaction === "upvote") {
    if (hasUpvoted) {
      // Remove upvote
      update = {
        $inc: { upvotes: -1 },
        $pull: { upvotes_user_id: user_id },
      };
    } else if (hasDownvoted) {
      // Switch from downvote → upvote
      update = {
        $inc: { upvotes: 2 }, // remove downvote (-1) and add upvote (+1)
        $pull: { downvotes_user_id: user_id },
        $addToSet: { upvotes_user_id: user_id },
      };
    } else {
      // Normal upvote
      update = {
        $inc: { upvotes: 1 },
        $addToSet: { upvotes_user_id: user_id },
      };
    }
  } else if (reaction === "downvote") {
    if (hasDownvoted) {
      // Remove downvote
      update = {
        $inc: { upvotes: 1 }, // removing previous downvote adds back to total
        $pull: { downvotes_user_id: user_id },
      };
    } else if (hasUpvoted) {
      // Switch from upvote → downvote
      update = {
        $inc: { upvotes: -2 }, // remove upvote (-1) and add downvote (-1)
        $pull: { upvotes_user_id: user_id },
        $addToSet: { downvotes_user_id: user_id },
      };
    } else {
      // Normal downvote
      update = {
        $inc: { upvotes: -1 },
        $addToSet: { downvotes_user_id: user_id },
      };
    }
  } else {
    return new Response("Invalid reaction", { status: 400 });
  }

  await db.collection(collection).updateOne({ _id: new ObjectId(content_id) }, update);
  const updated_ = await db.collection(collection).findOne({_id: new ObjectId(content_id)});
  return new Response(JSON.stringify({ success: true, updated: updated_ }), { status: 200 });
}
