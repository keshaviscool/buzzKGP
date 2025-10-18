import { Provider } from "@/components/ui/provider"
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
// import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})


export const metadata = {
  title: 'BuzzKGP',
  description: 'Reddit, but for IIT KGP',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Debug log to verify environment variables
  console.log('Clerk Environment Check:', {
    hasPublishableKey: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    publishableKeyLength: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.length
  });

  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    console.error('Missing Clerk Publishable Key in environment');
  }

  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {/* <header className="flex justify-end items-center p-4 gap-4 h-16">
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
          </header> */}
          <Provider>
            {/* <Navbar /> */}
            {children}
            </Provider>
        </body>
      </html>
    </ClerkProvider>
  )
  
}
