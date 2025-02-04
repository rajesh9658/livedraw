"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { ThemeToggle } from "./themetogle"
import { Menu, X } from "lucide-react" // Icons for menu toggle

type User = {
  name: string
  email: string
  image?: string
}

export function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [isOpen, setIsOpen] = useState(false) // State to toggle menu
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/")
  }

  return (
    <header className="bg-primary text-primary-foreground p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo / App Name */}
        <Link href="/" className="text-xl font-bold">
          Exledrawer
        </Link>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-primary-foreground focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Navigation (Hidden on Mobile) */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/rooms" className="hover:text-muted-foreground">Rooms</Link>
          <Link href="/profile" className="hover:text-muted-foreground">Profile</Link>
        </nav>

        {/* User Info & Theme Toggle (Hidden on Mobile) */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <div className="flex items-center space-x-2">
                {user.image ? (
                  <img src={user.image} alt={`${user.name}'s profile`} className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary-foreground text-primary flex items-center justify-center font-bold">
                    {user.name[0].toUpperCase()}
                  </div>
                )}
                <span>{user.name}</span>
              </div>
              <button onClick={handleLogout} className="text-primary-foreground hover:text-muted-foreground">
                Logout
              </button>
            </>
          ) : (
            <Link href="/auth" className="hover:text-muted-foreground">
              Sign Up / Sign In
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>

      {/* Collapsible Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-primary text-primary-foreground p-4 space-y-4">
          <Link href="/rooms" className="block hover:text-muted-foreground" onClick={() => setIsOpen(false)}>
            Rooms
          </Link>
          <Link href="/profile" className="block hover:text-muted-foreground" onClick={() => setIsOpen(false)}>
            Profile
          </Link>
          {user ? (
            <>
              <div className="flex items-center space-x-2">
                {user.image ? (
                  <img src={user.image} alt={`${user.name}'s profile`} className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary-foreground text-primary flex items-center justify-center font-bold">
                    {user.name[0].toUpperCase()}
                  </div>
                )}
                <span>{user.name}</span>
              </div>
              <button onClick={handleLogout} className="block w-full text-left hover:text-muted-foreground">
                Logout
              </button>
            </>
          ) : (
            <Link href="/auth" className="block hover:text-muted-foreground" onClick={() => setIsOpen(false)}>
              Sign Up / Sign In
            </Link>
          )}
          <ThemeToggle />
        </div>
      )}
    </header>
  )
}
