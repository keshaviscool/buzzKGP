/* eslint-disable */

"use client";
export const dynamic = "force-dynamic";

import {
  Box,
  Flex,
  Button,
  HStack,
  Avatar,
  Text,
  IconButton,
  Image,
  VStack,
  Collapsible,
} from "@chakra-ui/react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";

import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { useSearchParams } from "next/navigation";

function Navbar() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [isOpen, setIsOpen] = useState(false);
  // @ts-ignore
    const searchParams = useSearchParams();

  const by = searchParams.get("by");
  

  return (
    <Box 
      px={6} 
      py={3} 
      boxShadow="sm" 
      position="sticky" 
      top="0" 
      zIndex="100" 
      bg="black"
      backdropFilter="blur(10px)"
      borderBottom="1px solid"
      borderColor="gray.100"
    >
      {/* Desktop View */}
      <Flex 
        display={{ base: "none", md: "grid" }} 
        gridTemplateColumns="1fr 1fr 1fr" 
        gap="10px"
      >
        <Box justifySelf="start" alignSelf={"center"}>
          <Link href="/">
            <Text fontSize="lg" fontWeight="bold">
              Buzz KGP 👀
            </Text>
          </Link>
        </Box>

        <Flex justifySelf="center" gap={2}>
          <Link href="/">
            <Button colorScheme="blue" variant={by != "me" ? "solid" : "outline"} w="full">
              Home 🏡

            </Button>
          </Link>
          <Link href="/?by=me">
            <Button colorScheme="gray" variant={by == "me" ? "solid" : "outline"} w="full">
              My Buzz 🐝
            </Button>
          </Link>
          <Link href="/post/new">
            <Button colorScheme="blue" variant="ghost" w="full">
              Create Buzz 🗣️
            </Button>
          </Link>
        </Flex>

        <Flex justifySelf="end" alignItems="center" gap={3}>
          {user && (
            <>
              <Avatar.Root variant="outline" size="sm">
                <Avatar.Fallback name={user.fullName || "User"} />
                <Avatar.Image src={user.imageUrl} />
              </Avatar.Root>
              <Text display={{ base: "none", lg: "block" }} fontWeight="medium">{user.fullName}</Text>
              <Button
                size="sm"
                colorScheme="red"
                variant="ghost"
                onClick={() => signOut()}
              >
                Logout
              </Button>
            </>
          )}
        </Flex>
      </Flex>

      {/* Mobile View */}
      <Flex 
        display={{ base: "flex", md: "none" }} 
        justify="space-between" 
        align="center"
      >
        <Link href="/">
          <Text fontSize="lg" fontWeight="bold">
            Buzz KGP 👀
          </Text>
        </Link>

        {user && (
          <Box>
            <Avatar.Root variant="outline" size="sm">
              <Avatar.Fallback name={user.fullName || "User"} />
              <Avatar.Image src={user.imageUrl} />
            </Avatar.Root>
          </Box>
        )}

        <Button
          display="flex"
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          p={2}
        >
          {isOpen ? <IoClose size={24} /> : <GiHamburgerMenu size={24} />}
        </Button>


        {/* Desktop Menu */}
        {/* <HStack alignSelf={"flex-end"}>

          {user ? (
            <HStack spacing={3} alignSelf={"flex-end"}>
                <Avatar.Root variant={"outline"} size="sm">
                        <Avatar.Fallback name={user.fullName || "User"} />
                        <Avatar.Image src={user.imageUrl} />
                    </Avatar.Root>
              <Text fontWeight="medium">{user.fullName}</Text>
              <Button
                size="sm"
                colorScheme="red"
                variant="ghost"
                onClick={() => signOut()}
              >
                Logout
              </Button>
            </HStack>
          ): <SignInButton><Button>Log in</Button></SignInButton>}
        </HStack> */}

        {/* Mobile Menu */}
        {isOpen && (
          <Box
            position="fixed"
            top="60px"
            left={0}
            right={0}
            bg="black"
            pb={4}
            px={6}
            borderTop="1px solid"
            borderColor="gray.100"
            boxShadow="sm"
            backdropFilter="blur(10px)"
            zIndex={99}
          >
            <Flex direction="column" gap={4} mt={5}>
              <Link href="/">
                <Button colorScheme="blue" variant={by != "me" ? "solid" : "outline"} w="full">
                  Home 🏡
                </Button>
              </Link>
              <Link href="/?by=me">
                <Button colorScheme="gray" variant={by == "me" ? "solid" : "outline"} w="full">
                  My Buzz 🐝
                </Button>
              </Link>
              <Link href="/post/new">
                <Button colorScheme="blue" variant="ghost" w="full">
                  Create Buzz 🗣️
                </Button>
              </Link>
              {user && (
                <Button
                  size="sm"
                  colorScheme="red"
                  variant="ghost"
                  w="full"
                  onClick={() => signOut()}
                >
                  Logout
                </Button>
              )}
            </Flex>
          </Box>
        )}
      </Flex>
    </Box>
  );
}

export default Navbar;
