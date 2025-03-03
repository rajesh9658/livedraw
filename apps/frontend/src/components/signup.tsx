"use client"

import { useState } from "react"
import { signUp } from "../app/action/auth"

interface SignUpProps {
  onSuccessfulSignUp: (email: string) => void
}

export function SignUp({ onSuccessfulSignUp }: SignUpProps) {
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    const result = await signUp(formData)
    if (result.error) {
      setError(result.error)
    } else {
      const email = formData.get("email") as string
      onSuccessfulSignUp(email)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <p className="mb-4 text-muted-foreground">Create a new account to get started.</p>
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            className="w-full px-3 py-2 border rounded bg-background text-foreground"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full px-3 py-2 border rounded bg-background text-foreground"
            placeholder="Your email"
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full px-3 py-2 border rounded bg-background text-foreground"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="w-full bg-primary text-primary-foreground py-2 rounded hover:opacity-80">
          Sign Up
        </button>
      </form>
    </div>
  )
}
