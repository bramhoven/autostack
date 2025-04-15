import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Server, ArrowLeft } from "lucide-react"
import { AuthForm } from "@/components/auth/auth-form"

export default function ForgotPasswordPage() {
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
        <p className="mt-2 text-center text-sm text-muted-foreground">
          We'll send you an email with a link to reset your password
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Card className="border-primary/10 shadow-xl">
          <CardHeader>
            <CardTitle>Forgot Password</CardTitle>
            <CardDescription>Enter your email to receive a password reset link</CardDescription>
          </CardHeader>
          <CardContent>
            <AuthForm type="reset" />
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
