"use client";
import { useEffect, useState } from "react";
import { Post } from "@/lib/types";
import Link from "next/link";
import Navbar from "@/lib/navbarComponent";
import { RedirectToSignIn, SignedOut } from "@clerk/nextjs";
import { Avatar, Button, Card, Spinner, Box, Text } from "@chakra-ui/react";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { user, isLoaded } = useUser();

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
  }, []);

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <Navbar />

      {/* Loading overlay */}
      {loading ? (
        <Box
          height="70vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          <Spinner size="xl" color="blue.500" thickness="4px" speed="0.8s" />
          <Text mt={3} fontSize="lg" color="gray.600">
            Loading posts...
          </Text>
        </Box>
      ) : (
        <div
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {posts.map((post) => (
            <Card.Root
              marginRight={60}
              marginLeft={60}
              marginTop={8}
              key={post?._id}
            >
              <Link href={`/post/${post._id}`} key={post._id}>
                <Card.Body>
                  <Card.Title mt="2">{post.title}</Card.Title>
                  <Card.Description>
                    {post.content.slice(0, 200)}
                    {post.content.length > 200 ? "..." : ""}
                  </Card.Description>
                </Card.Body>
              </Link>
            </Card.Root>
          ))}

          {posts.length === 0 && (
            <Box textAlign="center" mt={10}>
              <Text fontSize="lg" color="gray.500">
                No posts yet. Create one!
              </Text>
            </Box>
          )}
        </div>
      )}
    </>
  );
}
