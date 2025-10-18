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

