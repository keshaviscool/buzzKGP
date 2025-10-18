"use client";
import CommentComponent from "@/lib/commentComponent";
import Navbar from "@/lib/navbarComponent";
import { Post } from "@/lib/types";
import { RedirectToSignIn, SignedOut } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Avatar, Button, Card, Spinner, Box, Text } from "@chakra-ui/react";
import Link from "next/link";

export default function PostDetails({ params }: { params: { postId: string } }) {
  const [post, setPost] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postId = (await params).postId;

        const [postRes, commentRes] = await Promise.all([
          fetch(`/api/posts?post_id=${postId}`),
          fetch(`/api/comments?post_id=${postId}`),
        ]);

        const [postData, commentData] = await Promise.all([
          postRes.json(),
          commentRes.json(),
        ]);

        setPost(postData);
        setComments(commentData);
      } catch (error) {
        console.error("Error fetching post or comments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Navbar />
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>

      {/* Loading Spinner */}
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
            Loading post...
          </Text>
        </Box>
      ) : (
        <div>
          {/* Fallback for no post */}
          {!post || !post.title ? (
            <Box textAlign="center" mt={20}>
              <Text fontSize="xl" fontWeight="medium" color="gray.500">
                This post doesn’t exist or may have been deleted.
              </Text>
            </Box>
          ) : (
            <Card.Root marginRight={60} marginLeft={60} marginTop={8}>
              <Card.Body>
                <Card.Title mt="2">{post?.title}</Card.Title>
                <Card.Description
                  dangerouslySetInnerHTML={{ __html: post?.content }}
                />
              </Card.Body>
            </Card.Root>
          )}

          {/* Comments Section */}
          <Card.Root marginRight={60} marginLeft={60} marginTop={8}>
            <Card.Body>
              <Card.Title mt="2">Discussion</Card.Title>

              <Card.Body color="white">
                {comments.length > 0 ? (
                  comments.map((cmt) => (
                    <CommentComponent comment={cmt} key={cmt?._id} />
                  ))
                ) : (
                  <Text fontSize="md" color="gray.500" mt={3}>
                    No comments yet. Be the first to share your thoughts!
                  </Text>
                )}
              </Card.Body>
            </Card.Body>
          </Card.Root>
        </div>
      )}
    </div>
  );
}
