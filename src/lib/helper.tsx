import { ObjectId } from "mongodb";
import clientPromise from "./db";
import { Comment, Post } from "./types";


export async function seedDummyPosts() {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const postsCollection = db.collection<Post>("posts");
    const dummyPosts: Post[] = [
        {
            title: "Lbs hall mess",
            content: "the food is so bad and good at the same time.",
            user_id: 1,
            date_created: new Date(),
        },
        {
            title: "Thoughts on AI",
            content: "well i dont agree to some points but its fine so yeah who gives a fuck",
            user_id: 2,
            date_created: new Date(),
        },
    ];

    const result = await postsCollection.insertMany(dummyPosts);
    console.log(`Inserted ${result.insertedCount} dummy posts`);
}


export async function seedDummyComments() {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const comments = db.collection<Comment>("comments");
    const dummyComments: Comment[] = [
        {
            body: "i do agree, but paneer is sometimes nice ",
            user_id: "2",
            reply_to: "post",
            post_id: "68f21034c8d7e7a5fee0fb36",
            date_created: new Date()
        }
    ];

    const result = await comments.insertMany(dummyComments);
    console.log(`Inserted ${result.insertedCount} dummy comments`);
}


export function getTimeAgo(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (weeks < 5) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  return `${years} year${years > 1 ? "s" : ""} ago`;
}


