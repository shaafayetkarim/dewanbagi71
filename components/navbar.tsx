"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { PenTool, Menu, X, LogOut } from 'lucide-react'
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { MotionDiv } from "@/components/ui/motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useToast } from "@/hooks/use-toast"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Don't show navbar on login/signup pages
  if (pathname === "/login" || pathname === "/signup" || pathname === "/") {
    return null
  }

  // Mock user data - in a real app, this would come from auth context
  const user = {
    name: "John Doe",
    email: "john@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
  }

  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Generate", href: "/generate" },
    { name: "Drafts", href: "/drafts" },
    { name: "Collections", href: "/collections" },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-[2000px]">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 md:gap-6">
            <Link href="/dashboard" className="flex items-center gap-2">
              <MotionDiv initial={{ rotate: -10 }} animate={{ rotate: 0 }} transition={{ duration: 0.5, type: "spring" }}>
                <PenTool className="h-6 w-6" />
              </MotionDiv>
              <span className="hidden text-xl font-bold md:inline-block">BlogAI</span>
            </Link>

            <div className="hidden md:flex md:items-center md:gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === item.href ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex md:items-center md:gap-2">
              <ModeToggle />
              <div className="flex items-center gap-2 pl-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium lg:inline-block">{user.name}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => {
                  // Add actual logout logic here
                  router.push('/login');
                  toast({
                    title: "Logged out",
                    description: "You have been successfully logged out",
                  });
                }}
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Log out</span>
              </Button>
            </div>

            <div className="md:hidden">
              <SidebarTrigger />
            </div>

            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <MotionDiv
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="container border-t md:hidden"
            >
          <div className="flex flex-col space-y-3 py-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href ? "bg-muted text-primary" : "text-muted-foreground"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex items-center justify-between px-4 py-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <ModeToggle />
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => {
                    // Add actual logout logic here
                    router.push('/login');
                    toast({
                      title: "Logged out",
                      description: "You have been successfully logged out",
                    });
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="sr-only">Log out</span>
                </Button>
              </div>
            </div>
          </div>
        </MotionDiv>
      )}
    </header>
  )
}

