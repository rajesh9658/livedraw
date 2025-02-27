"use client"

import { useState } from "react"
import { SignIn } from "./Signin"
import { SignUp } from "./signup"

export function AuthLayout() {
  const [isSignIn, setIsSignIn] = useState(true)
  const [newUser, setNewUser] = useState<{ email: string } | null>(null)

  const handleSuccessfulSignUp = (email: string) => {
    setNewUser({ email })
    setIsSignIn(true)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="bg-background border border-border p-8 rounded-lg shadow-md w-full max-w-md">
        {isSignIn ? <SignIn newUser={newUser} /> : <SignUp onSuccessfulSignUp={handleSuccessfulSignUp} />}
        <div className="mt-6 text-center">
          <button onClick={() => setIsSignIn(!isSignIn)} className="text-sm text-primary hover:underline">
            {isSignIn ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  )
}
