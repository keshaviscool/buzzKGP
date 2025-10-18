"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Box, Spinner, Text } from "@chakra-ui/react";

const PostList = dynamic(() => import("./PostList"), {
  ssr: false,
  loading: () => (
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
  ),
});

export default function PostListWrapper() {
  return (
    <Suspense
      fallback={
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
      }
    >
      <PostList />
    </Suspense>
  );
}