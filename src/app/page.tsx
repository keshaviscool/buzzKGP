"use client";
import { useEffect, useState } from "react";
import { Post } from "@/lib/types";
import Link from "next/link";
import Navbar from "@/lib/navbarComponent";
import { RedirectToSignIn, SignedOut } from "@clerk/nextjs";
import { Avatar, Button, Card, Spinner, Box, Text } from "@chakra-ui/react";
import { useUser } from "@clerk/nextjs";
 import { useSearchParams } from 'next/navigation';
// import { getTimeAgo } from "@/lib/helper";

export default function Home() {
  const { user, isLoaded } = useUser();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();

  const getTimeAgo = (dateInput: string | Date)=> {
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



  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let res;
        if (searchParams.get("by") == "me") {
            res = await fetch(`/api/posts?user_id=${user?.id}`);
        } else {
            res = await fetch("/api/posts");
        }
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
  }, [isLoaded, searchParams]);

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
            <Box
              marginRight={60}
              marginLeft={60}
              marginTop={8}
            >
                {
                    searchParams.get("by") != "me" ? <><Text>Hey <b> {user?.firstName}</b> 👋🏻</Text>
              <Text fontSize={30}>checkout what's buzzing in KGP 🐝!</Text></>
              : <Text fontSize={30}>See what buzz you have created 🗣️</Text>
                }
              
            </Box>
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
                  <Card.Title fontSize={11}>{getTimeAgo(post.date_created)}</Card.Title>
                  <Card.Description dangerouslySetInnerHTML={{"__html": post.content.slice(0, 200)}}>
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
