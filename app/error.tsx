"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background-texture">
      <div className="container flex flex-col items-center justify-center gap-6 px-4 py-16 ">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Error</h1>
          <h2 className="text-2xl font-semibold">Something went wrong</h2>
          <p className="text-muted-foreground text-center">Sorry, an unexpected error has occurred.</p>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={reset}
            className="rounded-full px-6 gap-2 bg-accent-gradient hover:opacity-90 transition-all duration-300 shadow-md"
          >
            Try Again
          </Button>
          <Link href="/">
            <Button variant="outline" className="rounded-full px-6">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
