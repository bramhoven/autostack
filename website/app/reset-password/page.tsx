"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Server, ArrowLeft, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function ResetPasswordPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isValidLink, setIsValidLink] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    // Check if the reset password link is valid
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (error || !data.session) {
        toast({
          title: "Invalid or expired link",
          description: "Please request a new password reset link.",
          variant: "destructive",
        })
        setIsValidLink(false)
      } else {
        setIsValidLink(true)
      }
    }

    checkSession()
  }, [toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match")
      }

      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) throw error

      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      })

      router.push("/login")
    } catch (error: any) {
      toast({
        title: "Password reset failed",
        description: error.message || "An error occurred during password reset.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isValidLink) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center py-12 sm:px-6 lg:px-8 bg-muted/10 relative">
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-grid-small-black/[0.2] bg-[length:16px_16px] [mask-image:linear-gradient(to_bottom,white,transparent)] dark:bg-grid-small-white/[0.2]"></div>
        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <Card className="border-primary/10 shadow-xl">
            <CardHeader>
              <CardTitle>Invalid Reset Link</CardTitle>
              <CardDescription>This password reset link is invalid or has expired.</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <Link href="/forgot-password">
                <Button>Request New Reset Link</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 sm:px-6 lg:px-8 bg-muted/10 relative">
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-grid-small-black/[0.2] bg-[length:16px_16px] [mask-image:linear-gradient(to_bottom,white,transparent)] dark:bg-grid-small-white/[0.2]"></div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="flex items-center gap-2 font-semibold">
            <div className="bg-gradient-to-r from-primary to-primary/70 p-1.5 rounded-md text-primary-foreground">
              <Server className="h-6 w-6" />
            </div>
            <span className="text-2xl">ServerSoft</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">Reset your password</h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">Enter your new password below</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Card className="border-primary/10 shadow-xl">
          <CardHeader>
            <CardTitle>Create New Password</CardTitle>
            <CardDescription>Your password must be at least 8 characters long</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="rounded-md border-primary/20 focus-visible:ring-primary/30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="rounded-md border-primary/20 focus-visible:ring-primary/30"
                />
              </div>
              <Button
                type="submit"
                className="w-full rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-md shadow-primary/20"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t p-6">
            <Link href="/login" className="flex items-center text-sm text-muted-foreground hover:text-foreground group">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to login
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
