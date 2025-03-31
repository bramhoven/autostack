"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Server, Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"

export function PublicHeader() {
  const { user, isLoading } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 font-semibold">
          <div className="bg-gradient-to-r from-primary to-primary/70 p-1.5 rounded-md text-primary-foreground">
            <Server className="h-5 w-5" />
          </div>
          <span className="text-xl">ServerSoft</span>
        </div>
        <nav className="hidden md:flex gap-6">
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
                Dashboard
              </Link>
              <Link href="/servers" className="text-sm font-medium transition-colors hover:text-primary">
                Servers
              </Link>
              <Link href="/catalog" className="text-sm font-medium transition-colors hover:text-primary">
                Software Catalog
              </Link>
            </>
          ) : (
            <>
              <Link href="/catalog" className="text-sm font-medium transition-colors hover:text-primary">
                Software Catalog
              </Link>
              <Link href="/pricing" className="text-sm font-medium transition-colors hover:text-primary">
                Pricing
              </Link>
              <Link href="/docs" className="text-sm font-medium transition-colors hover:text-primary">
                Documentation
              </Link>
            </>
          )}
        </nav>
        <div className="flex items-center gap-4">
          {isLoading ? (
            <Button variant="ghost" size="sm" className="rounded-full px-4" disabled>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Loading...
            </Button>
          ) : user ? (
            <Link href="/dashboard">
              <Button
                size="sm"
                className="rounded-full px-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300"
              >
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="rounded-full px-4">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="sm"
                  className="rounded-full px-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300"
                >
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

