"use client";

import { Editor } from "@tinymce/tinymce-react";
import { useRef, useState } from "react";
import { Box, Input, Button, Text, Spinner } from "@chakra-ui/react";
import Navbar from "@/lib/navbarComponent";
import { useUser, SignedOut, RedirectToSignIn } from "@clerk/nextjs";

export default function NewPost() {
  const editorRef = useRef(null);
  const { user, isLoaded } = useUser();
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "" }>({
    text: "",
    type: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    // @ts-ignore
    const content = editorRef.current?.getContent();
    const payload = {
      title,
      content,
      user_id: user.id,
      date_created: new Date(),
      upvotes: 0,
      upvotes_user_id: [],
    downvotes_user_id: []
    };

    try {
      setIsLoading(true);
      setMessage({ text: "", type: "" });

      const res = await fetch("/api/posts/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create post");

      setMessage({ text: "Post created successfully!", type: "success" });
      setTitle("");
      // @ts-ignore
      editorRef.current?.setContent("");
    } catch (err) {
      setMessage({ text: "Error creating post. Please try again.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <Navbar />
      
      <Box maxW="700px" mx="auto" mt={6} px={{ base: 4, md: 8 }}>
        <Text 
          fontSize={{ base: "2xl", md: "3xl" }} 
          fontWeight="bold"
          textAlign={{ base: "center", md: "left" }}
          mb={{ base: 6, md: 8 }}
        > 
          <del>busy</del> buzzing in kgp 😎
        </Text>

        <form onSubmit={handleSubmit}>
          <Input
            placeholder="Buzz Headline"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            mb={4}
            size={{ base: "md", md: "lg" }}
            required
          />

          <Box 
            borderWidth="1px" 
            borderColor="gray.200" 
            borderRadius="md"
            mt={2}
            mb={6}
          >
            <Editor
              onInit={(_, editor) => (editorRef.current = editor)}
              initialValue="<p>jot down your buzz here...</p>"
              apiKey="whwj9f1t0gs14sjsz46e1p9pfn78sthq3pw8dtyg5b7gywip"
              init={{
                height: 400,
                menubar: true,
                plugins:
                  "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
                toolbar:
                  "undo redo | blocks fontfamily fontsize | bold italic underline | align lineheight | numlist bullist outdent indent | link image media table | removeformat",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                mobile: {
                  menubar: false,
                  toolbar: "undo redo | bold italic | link | bullist numlist"
                },
                resize: true,
                min_height: 300,
                max_height: 600,
                autoresize_bottom_margin: 16
              }}
            />
          </Box>

          <Box
            display="flex"
            flexDirection={{ base: "column", md: "row" }}
            alignItems="center"
            gap={4}
            mt={6}
          >
            <Button 
              type="submit" 
              colorScheme="blue" 
              disabled={isLoading}
              size={{ base: "md", md: "lg" }}
              width={{ base: "full", md: "auto" }}
            >
              {isLoading ? (
                <Spinner size="sm" mr={2} />
              ) : null}
              Create Post
            </Button>            {message.text && (
              <Text
                color={message.type === "success" ? "green.500" : "red.500"}
                fontWeight="medium"
                fontSize={{ base: "sm", md: "md" }}
                textAlign={{ base: "center", md: "left" }}
              >
                {message.text}
              </Text>
            )}
          </Box>
        </form>
      </Box>
    </>
  );
}
