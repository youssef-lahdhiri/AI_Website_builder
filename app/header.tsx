"use client"
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
const Header = () => {
    return ( 

  <header className="flex  absolute z-9 justify-end items-center p-4 gap-4 h-16">
            {/* <SignedOut>
              <SignInButton />
              <SignUpButton>
                <button className="bg-[#6c47ff] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              {/* <UserButton /> */}
            {/* </SignedIn> */} */
          </header>
     );
}
 
export 
default Header;