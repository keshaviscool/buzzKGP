"use client";
import CommentComponent from "@/lib/commentComponent";
import Navbar from "@/lib/navbarComponent";
import { Post } from "@/lib/types";
import { RedirectToSignIn, SignedOut } from "@clerk/nextjs";
import { useEffect, useState } from "react";

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
                <div style={{
                    display: "flex",
                    alignContent: "center",
                    alignItems: "center",
                    flexDirection: "column"
                }}>
                    <h2>{post?.title}</h2>
                    <p>
                        {post?.content}
                    </p>

                    <br />
                    <br />

                    <h3>comments</h3>

                    {comments.map((cmt) => {
                        return (
                                <CommentComponent comment={cmt} key={cmt?._id} />
                        );
                    })}

                </div>

        }
    </div>
}