"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signIn } from "@/app/action/auth"

export function SignIn() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    const result = await signIn(formData)
    if (result.error) {
      setError(result.error)
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Sign In</h2>
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
        <button type="submit" className="w-full bg-primary text-primary-foreground py-2 rounded hover:bg-primary/90">
          Sign In
        </button>
      </form>
      <div className="mt-4 space-y-2">
        <Link href="/forgot-password" className="block text-sm text-primary hover:underline">
          Forgot password?
        </Link>
        {/* <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-primary hover:underline">
            Sign up
          </Link>
        </p> */}
      </div>
    </div>
  )
}

