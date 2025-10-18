"use client";

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
    const searchParams = useSearchParams();

  const by = searchParams.get("by");
  

  return (
    <Box px={6} py={3} boxShadow="sm" position="sticky" top="0" zIndex="100">
      <div style={{ display:"grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
        {/* Left: Logo */}
        <HStack spacing={2} justifySelf={"start"}>
          <Link href={"/"}>
          <Text fontSize="lg" fontWeight="bold" >
            Buzz KGP
          </Text>
          </Link>
        </HStack>

        <HStack spacing={2} justifySelf={"center"}>
          
              <Link href="/">
                <Button colorScheme="blue" variant={by != "me" ? "solid" : "outline"} w="full">
                  Home
                </Button>
              </Link>
              <Link href="/?by=me">
                <Button colorScheme="gray" variant={by == "me" ? "solid" : "outline"} w="full">
                  My Posts
                </Button>
              </Link>
              <Link href="/post/new">
                <Button colorScheme="blue" variant="ghost" w="full">
                  Create Post
                </Button>
              </Link>
        </HStack>

        <HStack justifySelf={"end"}>
          {user && (
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
          )}
        </HStack>


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

        {/* Mobile Hamburger Button */}
        <Collapsible.Root open={isOpen} onOpenChange={!isOpen}>
          <Collapsible.Trigger asChild>
            <IconButton
              aria-label="Toggle Menu"
              // icon={isOpen ? <IoClose /> : <GiHamburgerMenu />}
              display={{ base: "flex", md: "none" }}
              variant="ghost"
            />
          </Collapsible.Trigger>

          {/* Mobile Collapsible Content */}
          <Collapsible.Content>
            <VStack
              align="stretch"
              spacing={4}
              mt={3}
              display={{ md: "none" }}
              pb={4}
              borderTop="1px solid"
              borderColor="gray.200"
            >
              <Link href="/create-post">
                <Button colorScheme="blue" w="full">
                  Create Post
                </Button>
              </Link>
              <Link href="/my-posts">
                <Button colorScheme="gray" variant="outline" w="full">
                  My Posts
                </Button>
              </Link>

              {/* {user && (
                <HStack justify="space-between" px={2}>
                  <HStack>
                    <Avatar.Root variant={"outline"} size="sm">
                        <Avatar.Fallback name={user.fullName || "User"} />
                        <Avatar.Image src={user.imageUrl} />
                    </Avatar.Root>
                    <Text>{user.fullName}</Text>
                  </HStack>
                  <Button
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => signOut()}
                  >
                    Logout
                  </Button>
                </HStack>
              ) } */}
              <HStack justify={"space-between"} px={2}>
                <SignedOut>
                  <SignInButton />
                  <SignUpButton>
                    <button className="bg-[#6c47ff] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                      Sign Up
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </HStack>

            </VStack>
          </Collapsible.Content>
        </Collapsible.Root>
      </div>
    </Box>
  );
}

export default Navbar;
