"use client";

import { useEffect, useState, Suspense } from "react";
import { Post } from "@/lib/types";
import Link from "next/link";
import { Card, Spinner, Box, Text } from "@chakra-ui/react";
import { useUser } from "@clerk/nextjs";
import { useSearchParams } from 'next/navigation';

function PostListContent() {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();

  const getTimeAgo = (dateInput: string | Date) => {
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
        if (searchParams.get("by") === "me") {
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
  }, [searchParams, user?.id]);

  if (loading) {
    return (
      <Box
        height="70vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Spinner size="xl" color="blue.500" borderWidth="4px" />
        <Text mt={3} fontSize="lg" color="gray.600">
          Loading posts...
        </Text>
      </Box>
    );
  }

  return (
    <Box w="full">
      <Box 
        maxW="container.xl" 
        mx="auto" 
        px={{ base: 4, md: 8, lg: 16 }} 
        py={8}
      >
        {searchParams.get("by") !== "me" ? (
          <>
            <Text fontSize={{ base: "lg", md: "xl" }}>
              Hey <b>{user?.firstName}</b> 👋🏻
            </Text>
            <Text fontSize={{ base: "2xl", md: "3xl" }}>checkout what&apos;s buzzing in KGP 🐝!</Text>
          </>
        ) : (
          <Text fontSize={{ base: "2xl", md: "3xl" }}>See what buzz you have created 🗣️</Text>
        )}
      </Box>

      <Box maxW="container.xl" mx="auto">
        {posts.map((post) => (
          <Box 
            px={{ base: 4, md: 8, lg: 16 }} 
            mb={4} 
            key={post?._id}
          >
            <Link href={`/post/${post._id}`}>
              <Card.Root>
                <Card.Body>
                  <Card.Title mt="2">{post.title}</Card.Title>
                  <Card.Title fontSize="xs">{getTimeAgo(post.date_created)}</Card.Title>
                  <Card.Description
                    dangerouslySetInnerHTML={{ __html: post.content.slice(0, 200) }}
                  ></Card.Description>
                </Card.Body>
              </Card.Root>
            </Link>
          </Box>
        ))}

        {posts.length === 0 && (
          <Box textAlign="center" mt={10} px={{ base: 4, md: 8, lg: 16 }}>
            <Text fontSize="lg" color="gray.500">
              No posts yet. Create one!
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default function PostList() {
  return (
    <Suspense fallback={
      <Box
        height="70vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Spinner size="xl" color="blue.500" borderWidth="4px" />
        <Text mt={3} fontSize="lg" color="gray.600">
          Loading...
        </Text>
      </Box>
    }>
      <PostListContent />
    </Suspense>
  );
}