"use client";
import CommentComponent from "@/lib/commentComponent";
import Navbar from "@/lib/navbarComponent";
import { Post } from "@/lib/types";
import { RedirectToSignIn, SignedOut } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Avatar, Button, Card } from "@chakra-ui/react"
import Link from "next/link";


export default function PostDetails(
    { params }: { params: { postId: string } }
) {


    const [post, setPost] = useState({});
    const [loading, setLoading] = useState<boolean>(true);
    const [comments, setComments] = useState([]);


    useEffect(() => {

        const getPost = async () => {
            const postId = (await params).postId;
            const res = await fetch(`/api/posts?post_id=${postId}`);
            const data = await res.json();
            setPost(data);

        }
        const getComments = async () => {
            const postId = (await params).postId;
            const res = await fetch(`/api/comments?post_id=${postId}`);
            const data = await res.json();
            console.log(data, "main post commments");

            setComments(data);
        }

        getPost();
        getComments();
        setLoading(false);

    }
        , [])


    return <div>
        <Navbar />
        <SignedOut>
            <RedirectToSignIn />
        </SignedOut>
        {
            loading ? "page loading mfer" :
                <div>
                    <Card.Root marginRight={60} marginLeft={60} marginTop={8}>
                        <Card.Body>
                            <Card.Title mt="2">{post?.title}</Card.Title>
                            <Card.Description>
                                {post?.content}
                            </Card.Description>
                        </Card.Body>
                    </Card.Root>

                    <Card.Root marginRight={60} marginLeft={60} marginTop={8}>
                        <Card.Body >
                            <Card.Title mt="2">Discussion</Card.Title>
                            <Card.Body color={"white"}>
                                {comments.map((cmt) => {
                                    return (
                                        <CommentComponent comment={cmt} key={cmt?._id} />
                                    );
                                })}
                            </Card.Body>
                        </Card.Body>
                    </Card.Root>

                </div>

            // <div style={{
            //     display: "flex",
            //     alignContent: "center",
            //     alignItems: "center",
            //     flexDirection: "column"
            // }}>
            //     <h2>{post?.title}</h2>
            //     <p>
            //         {post?.content}
            //     </p>

            //     <br />
            //     <br />

            //     <h3>comments</h3>

            // {comments.map((cmt) => {
            //     return (
            //             <CommentComponent comment={cmt} key={cmt?._id} />
            //     );
            // })}

            // </div>

        }
    </div>
}