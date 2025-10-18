/* eslint-disable */
"use client";
export const dynamic = "force-dynamic";

import CommentComponent from "@/lib/commentComponent";
import Navbar from "@/lib/navbarComponent";
import { useUser, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Spinner,
  Text,
  Fieldset,
  Field,
  Input,
} from "@chakra-ui/react";
import Link from "next/link";
import { useSearchParams, useParams } from "next/navigation";
import { Comment } from "@/lib/types";

export default function PostDetails() {
  const { user } = useUser();
  const params = useParams();
  const postId = params?.postId;
  // @ts-ignore
  const searchParams = useSearchParams();

  const [post, setPost] = useState({
    _id: "",
    title: "",
    content: ""
  });
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [body, setBody] = useState("");

  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | "";
  }>({ text: "", type: "" });

  // Fetch post and comments
  useEffect(() => {
    if (!postId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [postRes, commentRes] = await Promise.all([
          fetch(`/api/posts?post_id=${postId}`),
          fetch(
            `/api/comments?post_id=${postId}&sort=${searchParams.get("sort")}`
          ),
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
  }, [postId, searchParams?.toString(), message]);

  // Handle comment submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!body) {
      setMessage({ text: "Comment cannot be empty 😒", type: "error" });
      return;
    }

    const payload = {
      user_id: user.id,
      body: body,
      comment_replies_ids: [],
      reply_to: "post",
      post_id: post?._id,
      date_created: new Date(),
      upvotes: 0,
      upvotes_user_id: [],
      downvotes_user_id: [],
    };

    try {
      setLoading(true);
      setMessage({ text: "", type: "" });

      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create comment");

      setMessage({ text: "Comment created successfully!", type: "success" });
      setBody("");
    } catch (err) {
      setMessage({
        text: "Error creating comment. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box w="full">
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
          <Spinner size="xl" color="blue.500" borderWidth="4px" />
          <Text mt={3} fontSize="lg" color="gray.600">
            Loading post...
          </Text>
        </Box>
      ) : (
        <Box w="full">
          {/* Post Fallback */}
          {!post || !post.title ? (
            <Box textAlign="center" mt={20}>
              <Text fontSize="xl" fontWeight="medium" color="gray.500">
                This post doesn't exist or may have been deleted.
              </Text>
            </Box>
          ) : (
            <Box maxW="container.xl" mx="auto" px={{ base: 4, md: 8, lg: 16 }} mb={8}>
              <Card.Root>
                <Card.Body>
                  <Card.Title mt="2" fontSize={{ base: "xl", md: "2xl" }}>{post?.title}</Card.Title>
                  <Card.Description
                    dangerouslySetInnerHTML={{ __html: post?.content }}
                    fontSize={{ base: "md", md: "lg" }}
                  />
                </Card.Body>
              </Card.Root>
            </Box>
          )}

          {/* Comments Section */}
          <Box maxW="container.xl" mx="auto" px={{ base: 4, md: 8, lg: 16 }} mb={8}>
            <Card.Root>
              <Card.Body>
                <Card.Title mt="2" fontSize={{ base: "lg", md: "xl" }}>Discussion 🤔</Card.Title>

                {message.text && (
                  <Text
                    mt={3}
                    color={message.type === "success" ? "green.500" : "red.500"}
                    fontWeight="medium"
                  >
                    {message.text}
                  </Text>
                )}

                {/* Comment input + sort */}
                <Box
                  display="flex"
                  flexDirection={{ base: "column", md: "row" }}
                  alignItems={{ base: "stretch", md: "center" }}
                  gap={4}
                  mt={4}
                >
                  {/* Sort Controls */}
                  <Box 
                    display="flex" 
                    alignItems="center"
                    gap={2}
                    flexShrink={0}
                    flexWrap={{ base: "wrap", md: "nowrap" }}
                  >
                    <Text fontSize="sm" fontWeight="medium" whiteSpace="nowrap">
                      Sort by:
                    </Text>
                    <Link href="?sort=popular">
                      <Button
                        size={{ base: "sm", md: "xs" }}
                        variant={
                          searchParams.get("sort") == "popular" || !searchParams.get("sort")
                            ? "solid"
                            : "outline"
                        }
                      >
                        Popularity
                      </Button>
                    </Link>
                    <Link href="?sort=latest">
                      <Button
                        size={{ base: "sm", md: "xs" }}
                        variant={searchParams.get("sort") == "latest" ? "solid" : "outline"}
                      >
                        Latest
                      </Button>
                    </Link>
                  </Box>

                  {/* Comment Input */}
                  <Box 
                    display="flex" 
                    flex="1"
                    gap={2}
                  >
                    <Input
                      size={{ base: "sm", md: "xs" }}
                      value={body}
                      placeholder="Make a buzzz 🙂‍↔️"
                      onChange={(e) => setBody(e.target.value)}
                    />
                    <Button
                      size={{ base: "sm", md: "xs" }}
                      variant="solid"
                      onClick={handleSubmit}
                      flexShrink={0}
                    >
                      Comment
                    </Button>
                  </Box>
                </Box>

                {/* Comments List */}
                <Box mt={8}>
                  {comments.length > 0 ? (
                    <Box display="flex" flexDirection="column" gap={4}>
                      {comments.map((cmt: Comment) => (
                        <CommentComponent comment={cmt} key={cmt?._id} />
                      ))}
                    </Box>
                  ) : (
                    <Text 
                      fontSize={{ base: "md", md: "lg" }} 
                      color="gray.500" 
                      mt={3}
                      textAlign="center"
                    >
                      No comments yet. Be the first to share your thoughts 💭!
                    </Text>
                  )}
                </Box>
              </Card.Body>
            </Card.Root>
          </Box>
        </Box>
      )}
    </Box>
  );
}
