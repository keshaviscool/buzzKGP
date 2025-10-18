import { Box, Text, Button, Stack, Collapsible, Avatar, IconButton, Textarea } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Comment } from './types';
import { GoReply } from "react-icons/go";
import { BiUpvote, BiDownvote, BiSolidUpvote, BiSolidDownvote } from "react-icons/bi";
import { FaPlus, FaMinus } from "react-icons/fa";

import {
    Field,
    Fieldset,
    For,
    Input,
    NativeSelect,
} from "@chakra-ui/react"
import { useUser } from '@clerk/nextjs';
import axios from 'axios';

const submitReply = (user_id: string, body: string, parent_comment_id: string, post_id: string, replies, setReplies, setIsReply, setIsOpen) => {
    // console.log(user_id, body, parent_comment_id, post_id);

    let payload: Comment = {
        user_id: user_id,
        body: body,
        comment_replies_ids: [],
        reply_to: "comment",
        parent_comment_id: parent_comment_id,
        post_id: post_id,
        date_created: new Date(),
        upvotes: 0,
        upvotes_user_id: [],
        downvotes_user_id: []

    }

    const req = axios.post("/api/replies", payload)
    req.then((res) => {
        setIsReply(false)
        payload["_id"] = res.data.inserted.insertedId;
        replies.push(payload)
        setIsOpen(true)

    })


    // const res = await fetch("/api/replies");
    // if (!res.ok) throw new Error("Failed to fetch posts");
    // const data: Post[] = await res.json();
    // setPosts(data);
}


const CommentComponent = ({ comment }: { comment: Comment }) => {
    const { user, isLoaded } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const [isReply, setIsReply] = useState(false);
    const [replyBody, setReplyBody] = useState("");
    const [replies, setReplies] = useState<Comment[]>([]);
    const [commentUser, setCommentUser] = useState({});

    const [vote, setVote] = useState(0); // 1--> upvote, 0--> no vote, -1 --> downvote
    const [voteCount, setVoteCount] = useState(0)

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

    const handleReaction = async (reaction: string) => {
        // alert("called")
        if (!user) return;
        const user_id: string = user.id;
        if (reaction == "up") {

            const res = await fetch(`/api/reactions?user_id=${user_id}&type=comment&reaction=upvote&content_id=${comment._id}`);
            if (!res.ok) throw new Error("Failed to upvote");
            const data = await res.json()
            setVoteCount(data.updated.upvotes);

            if (data.updated.upvotes_user_id.includes(user_id)) { setVote(1) } else setVote(0)

            // }
        }
        if (reaction == "down") {
            // if (comment.downvotes_user_id.includes(user_id) ){return} else {
            const res = await fetch(`/api/reactions?user_id=${user_id}&type=comment&reaction=downvote&content_id=${comment._id}`);
            if (!res.ok) throw new Error("Failed to downvote");
            const data = await res.json()
            setVoteCount(data.updated.upvotes);

            if (data.updated.downvotes_user_id.includes(user_id)) { setVote(-1) } else setVote(0)
            // }
        }
    }

    useEffect(() => {
        if (comment.downvotes_user_id.includes(user?.id)) {
            setVote(-1)
        }

        if (comment.upvotes_user_id.includes(user?.id)) {
            setVote(1)
        }
        setVoteCount(comment?.upvotes)
        const getReplies = async () => {
            const commentId = comment._id;
            const res = await fetch(`/api/replies?comment_id=${commentId}`);
            const data = await res.json();

            setReplies(data);
        }
        const getCommentUser = async () => {
            const user_id = comment.user_id;
            const res = await fetch(`/api/user?user_id=${user_id}`);
            const data = await res.json();
            setCommentUser(data);
        }

        getReplies();
        getCommentUser();
    }, [user]);

    return (
        <Collapsible.Root unmountOnExit open={isOpen}>
            <Box mb={4} ml={4} margin={0}>
                <Stack direction="row" spacing={0} padding={0} borderRadius={"10px"}>
                    <Avatar.Root variant={"outline"}>
                        <Avatar.Fallback name={commentUser?.fullName} />
                        <Avatar.Image src={commentUser?.imageUrl} />
                    </Avatar.Root>
                    <Box padding={2}>
                        <Text fontSize={"xs"} fontWeight="bold">{commentUser?.fullName ? commentUser?.fullName : "User"}</Text>
                        <Text fontSize={11} color={"gray.400"}>{getTimeAgo(comment.date_created)}</Text>
                        <Text fontSize={"xs"}>{comment.body}</Text>
                        <Box display={'flex'} gap={"10px"} >

                            {
                                replies?.length == 0 ? "" : <Collapsible.Trigger asChild>
                                    <IconButton
                                        borderRadius={"40px"}

                                        size="xs"
                                        aria-label={isOpen ? "Hide Replies" : "Show Replies"}
                                        // _icon={ChevronUpIcon}
                                        variant="ghost"

                                        onClick={() => setIsOpen(!isOpen)}
                                    >{isOpen ? <FaMinus size={"10px"} /> : <FaPlus size={"10px"} />}</IconButton>
                                </Collapsible.Trigger>
                            }
                            <Button size={"xs"} onClick={() => handleReaction("up")} variant={"ghost"} style={{ display: "flex" }} padding={0.5}>
                                {vote == 0 || vote == -1 ? <BiUpvote /> : <BiSolidUpvote />}
                            </Button>
                            <Text fontSize={"xs"} style={{ display: "flex", alignItems: "center", justifyContent: "center" }} padding={0.5}>{voteCount}</Text>
                            <Button size={"xs"} onClick={() => handleReaction("down")} variant={"ghost"} style={{ display: "flex" }} padding={0.5}>
                                {vote == 0 || vote == 1 ? <BiDownvote /> : <BiSolidDownvote />}

                            </Button>
                            <Button size={"xs"} variant={"ghost"} style={{ display: "flex" }} padding={0.5} onClick={() => setIsReply(!isReply)}>

                                <GoReply />
                                <Text marginLeft={"3px"} fontSize={"10px"}>Reply</Text>
                            </Button>

                        </Box>
                        {isReply ?

                            <Fieldset.Root marginTop={2} size="xs" maxW="md" display={"flex"} flexDirection={"row"} alignItems={"center"} justifyContent={"center"}>

                                <Fieldset.Content>
                                    <Field.Root>
                                        {/* <Field.Label>Reply: </Field.Label> */}
                                        <Input size={"xs"} name="reply_comment"
                                            value={replyBody}
                                            onChange={(e) => setReplyBody(e.target.value)}
                                        />
                                    </Field.Root>
                                </Fieldset.Content>
                                <Button size={"xs"} marginLeft={3} variant={"solid"} marginTop={"0px"} type="submit" onClick={() => submitReply(user?.id, replyBody, comment._id, comment.post_id, replies, setReplies, setIsReply, setIsOpen)}>
                                    Reply
                                </Button>
                            </Fieldset.Root>

                            : ""}
                    </Box>
                </Stack>

                <Collapsible.Content>
                    <Stack spacing={4} ml={4}>
                        {replies.map((reply) => (
                            <CommentComponent key={reply._id} comment={reply} />
                        ))}
                    </Stack>
                </Collapsible.Content>
            </Box>
        </Collapsible.Root>
    );
};

export default CommentComponent;
