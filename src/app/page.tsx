
import { RedirectToSignIn, SignedOut } from "@clerk/nextjs";
import Navbar from "@/lib/navbarComponent";
import PostListWrapper from "@/components/PostListWrapper";

export default function Home() {
  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <Navbar />
      <PostListWrapper />
    </>
  );
}
