import { NextResponse } from "next/server";
import { createClerkClient } from '@clerk/backend'

const clerkClient = createClerkClient({ secretKey: "sk_test_Vi7EocsDNuZKnBPXX5611cGnmgQxzkaMMWwLIRvVj9" })

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json({ error: "user_id is required" }, { status: 400 });
    }
    // Fetch user from Clerk
    const user = await clerkClient.users.getUser(userId);
    

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const response = {
      id: user.id,
      fullName: user.fullName,
      imageUrl: user.imageUrl,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
