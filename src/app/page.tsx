"use client";
import { useEffect, useState } from "react"
import { Post } from "@/lib/types";
import Link from "next/link";

export default function Home() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch("/api/posts");
                if (!res.ok) throw new Error("Failed to fetch posts");
                const data: Post[] = await res.json();
                setPosts(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []); // dependency array ensures it runs once
    return <>

        {posts.map((post) => {
            return (
                <Link href={`/post/${post._id}`} key={post._id}>
                <div style={{ 
                    display: "flex",
                    alignContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    marginBottom: "15px"
                 }}>
                    <h2>{post.title}</h2>
                    <p>{post.content}</p>
                </div>
                </Link>
            );
        })}

    </>
}