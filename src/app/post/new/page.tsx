import Navbar from "@/lib/navbarComponent";
import { RedirectToSignIn, SignedOut } from "@clerk/nextjs";

export default function NewPost() {
    return <div>
        <SignedOut>
            <RedirectToSignIn />
        </SignedOut>
        <Navbar />
        Well hello there
    </div>
}