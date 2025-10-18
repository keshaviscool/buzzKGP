import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";


export async function POST(request:Request) {
    const client = await clientPromise;
    const db = client.db("buzzKGP");
    const data = await request.json(); // Parses the request body as JSON
    // Now 'data' contains the JSON object sent by the client

    // Process the data, e.g., save to a database, perform calculations
    const inserted_ = await db.collection("posts").insertOne(data)

    // Send a response back to the client
    return NextResponse.json({ message: 'Data received successfully!', inserted: inserted_ }, { status: 200 });
}