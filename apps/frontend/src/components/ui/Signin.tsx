"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signIn } from "../../app/action/auth"

interface SignInProps {
  newUser: { email: string } | null
}

export function SignIn({ newUser }: SignInProps) {
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (newUser) {
      setEmail(newUser.email)
    }
  }, [newUser])

  async function handleSubmit(formData: FormData) {
    const result = await signIn(formData)
    if (result.error) {
      setError(result.error)
    } else {
      // Store user data in localStorage
      // localStorage.setItem("user", JSON.stringify(result.user))
      router.push("/dashboard")
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Sign In</h2>
      {newUser && <p className="mb-4 text-green-500">Account created successfully! Please sign in.</p>}
      <p className="mb-4 text-muted-foreground">Enter your email and password to sign in.</p>
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          Sign In
        </button>
      </form>
      <div className="mt-4 space-y-2">
        <Link href="/forgot-password" className="block text-sm text-primary hover:underline">
          Forgot password?
        </Link>
      </div>
    </div>
  )
}

