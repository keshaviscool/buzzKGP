import { Box, Text, Button, Stack, Collapsible, Avatar, IconButton, Textarea } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Comment } from './types';
import { GoReply } from "react-icons/go";
import { BiUpvote } from "react-icons/bi";
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
        date_created: new Date()

    }
    
    const req = axios.post("/api/replies", payload)
    req.then((res)=>{ 
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



    useEffect(() => {
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
    }, []);

    return (
        <Collapsible.Root unmountOnExit open={isOpen}>
            <Box mb={4} ml={4} margin={0}>
                <Stack direction="row" spacing={4} padding={2} borderRadius={"10px"}>
                    <Avatar.Root variant={"outline"}>
                        <Avatar.Fallback name={commentUser?.fullName} />
                        <Avatar.Image src={commentUser?.imageUrl} />
                    </Avatar.Root>
                    <Box padding={2}>
                        <Text fontWeight="bold">{commentUser?.fullName ? commentUser?.fullName : "User"}</Text>
                        <Text>{comment.body}</Text>
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
                            <Button size={"xs"} variant={"ghost"} style={{ display: "flex" }} padding={0.5}>
                                <BiUpvote />
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
                                        <Textarea size={"xs"} name="reply_comment" 
                                        value={replyBody}
                                        onChange={(e) => setReplyBody(e.target.value) }
                                        />
                                    </Field.Root>
                                </Fieldset.Content>
                                <Button size={"xs"} variant={"ghost"} marginTop={"0px"} type="submit" onClick={()=> submitReply(user?.id, replyBody, comment._id, comment.post_id, replies, setReplies, setIsReply, setIsOpen)}>
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
