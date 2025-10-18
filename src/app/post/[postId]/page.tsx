"use client";
import CommentComponent from "@/lib/commentComponent";
import Navbar from "@/lib/navbarComponent";
import { Post } from "@/lib/types";
import { RedirectToSignIn, SignedOut, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Avatar, Button, Card, Spinner, Box, Text, Fieldset, Textarea, Field, Input } from "@chakra-ui/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PostDetails({ params }: { params: { postId: string } }) {
    const { user, isLoaded } = useUser();
    const searchParams = useSearchParams();
    const [post, setPost] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [comments, setComments] = useState<any[]>([]);
    const [body, setBody] = useState("");

    const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "" }>({
        text: "",
        type: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        if (!body) {
            setMessage({ text: "Comment cannot be empty 😒", type: "error" });
            return
        };

        let payload = {
            user_id: user.id,
            body: body,
            comment_replies_ids: [],
            reply_to: "post",
            post_id: post._id,
            date_created: new Date(),
            upvotes: 0,
            upvotes_user_id: [],
            downvotes_user_id: []

        }

        try {
            setLoading(true);
            setMessage({ text: "", type: "" });

            const res = await fetch("/api/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to create post");

            setMessage({ text: "Comment created successfully!", type: "success" });
            setBody("");
        } catch (err) {
            setMessage({ text: "Error creating post. Please try again.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const postId = (await params).postId;

                const [postRes, commentRes] = await Promise.all([
                    fetch(`/api/posts?post_id=${postId}`),
                    fetch(`/api/comments?post_id=${postId}&sort=${searchParams.get("sort")}`),
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
    }, [message, searchParams]);


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
                            <Card.Title mt="2">Discussion 🤔</Card.Title>
                            {message.text && (
                                <Text
                                    mt={3}
                                    color={message.type === "success" ? "green.500" : "red.500"}
                                    fontWeight="medium"
                                >
                                    {message.text}
                                </Text>
                            )}

                            <Card.Body >
                                <Fieldset.Root marginTop={2} size="xs" maxW="100%" display={"flex"} flexDirection={"row"} alignItems={"center"} justifyContent={"center"}>
                                    <Text fontSize={"xs"} w={20} marginLeft={3}>
                                        Sort by:
                                    </Text>
                                    <Link href={"?sort=popular"}>
                                    <Button size={"xs"} marginLeft={3} variant={searchParams.get("sort") == "popular" || !searchParams.get("sort")  ? "solid" : "outline"} marginTop={"0px"}>
                                        Popularity
                                    </Button>
                                    </Link>
                                    <Link href={"?sort=latest"}>
                                    <Button size={"xs"} marginLeft={3} marginRight={3} variant={searchParams.get("sort") == "latest" ? "solid" : "outline"} marginTop={"0px"}>
                                        Latest
                                    </Button>
                                    </Link>
                                    <Fieldset.Content>
                                        <Field.Root>
                                            {/* <Field.Label>Reply: </Field.Label> */}
                                            <Input size={"xs"} name="reply_comment"
                                                value={body}
                                                placeholder="make a buzzz 🙂‍↔️"
                                                onChange={(e) => setBody(e.target.value)}
                                            />
                                        </Field.Root>
                                    </Fieldset.Content>
                                    <Button size={"xs"} marginLeft={3} variant={"solid"} marginTop={"0px"} type="submit" onClick={handleSubmit}>
                                        Comment
                                    </Button>
                                </Fieldset.Root>
                                <Box mt={5}>
                                {comments.length > 0 ? (
                                    comments.map((cmt) => (
                                        <CommentComponent comment={cmt} key={cmt?._id} />
                                    ))
                                ) : (
                                    <Text fontSize="md" color="gray.500" mt={3}>
                                        No comments yet. Be the first to share your thoughts 💭!
                                    </Text>
                                )}
</Box>
                            </Card.Body>
                        </Card.Body>
                    </Card.Root>
                </div>
            )}
        </div>
    );
}
