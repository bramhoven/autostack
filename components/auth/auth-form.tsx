"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface AuthFormProps {
  type: "login" | "signup" | "reset"
}

export function AuthForm({ type }: AuthFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (type === "signup") {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match")
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
            },
            emailRedirectTo: `${window.location.origin}/api/auth/callback`,
          },
        })

        if (error) throw error

        toast({
          title: "Account created",
          description: "Please check your email to confirm your account.",
        })

        router.push("/login")
      } else if (type === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        toast({
          title: "Login successful",
          description: "You have been logged in successfully.",
        })

        // Force a hard refresh to ensure cookies are properly set
        window.location.href = "/dashboard"
      } else if (type === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        })

        if (error) throw error

        toast({
          title: "Password reset email sent",
          description: "Check your email for a password reset link.",
        })
      }
    } catch (error: any) {
      console.error("Authentication error:", error)

      // Create a user-friendly error message based on the error code or message
      const errorTitle =
        type === "login" ? "Login failed" : type === "signup" ? "Signup failed" : "Password reset failed"
      let errorMessage = "An unexpected error occurred. Please try again."

      // Handle common Supabase auth errors with friendly messages
      if (error.code) {
        switch (error.code) {
          case "auth/invalid-email":
            errorMessage = "Please enter a valid email address."
            break
          case "auth/user-not-found":
          case "auth/invalid-login-credentials":
          case "invalid_grant":
            errorMessage = "Invalid email or password. Please try again."
            break
          case "auth/wrong-password":
            errorMessage = "Incorrect password. Please try again."
            break
          case "auth/email-already-in-use":
            errorMessage = "This email is already registered. Please use a different email or try logging in."
            break
          case "auth/weak-password":
            errorMessage = "Password is too weak. Please use a stronger password."
            break
          case "auth/too-many-requests":
            errorMessage = "Too many unsuccessful login attempts. Please try again later."
            break
          case "auth/network-request-failed":
            errorMessage = "Network error. Please check your internet connection and try again."
            break
          default:
            // If we have a message from the error, use it
            errorMessage = error.message || errorMessage
        }
      } else if (error.message) {
        // Use the error message if available
        errorMessage = error.message
      }

      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {type === "signup" && (
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="rounded-md border-primary/20 focus-visible:ring-primary/30"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="your.email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded-md border-primary/20 focus-visible:ring-primary/30"
        />
      </div>

      {type !== "reset" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            {type === "login" && (
              <Button
                type="button" // Explicitly set type to button to prevent form submission
                variant="link"
                className="p-0 h-auto text-xs text-primary hover:text-primary/80"
                onClick={() => router.push("/forgot-password")}
              >
                Forgot password?
              </Button>
            )}
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded-md border-primary/20 focus-visible:ring-primary/30"
          />
        </div>
      )}

      {type === "signup" && (
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="rounded-md border-primary/20 focus-visible:ring-primary/30"
          />
        </div>
      )}

      <Button
        type="submit"
        className="w-full rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-md shadow-primary/20"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {type === "login" ? "Signing in..." : type === "signup" ? "Creating account..." : "Sending reset link..."}
          </>
        ) : type === "login" ? (
          "Sign in"
        ) : type === "signup" ? (
          "Create account"
        ) : (
          "Send reset link"
        )}
      </Button>
    </form>
  )
}
