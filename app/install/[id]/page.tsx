"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { ArrowLeft, Server, Upload, CheckCircle, AlertCircle, Info } from "lucide-react"

// Mock data for software details
const softwareDetails = {
  1: {
    id: 1,
    name: "Nginx",
    category: "web-server",
    description: "High-performance HTTP server and reverse proxy",
    image: "/placeholder.svg?height=80&width=80",
    longDescription:
      "NGINX is a free, open-source, high-performance HTTP server and reverse proxy, as well as an IMAP/POP3 proxy server. NGINX is known for its high performance, stability, rich feature set, simple configuration, and low resource consumption.",
    requirements: "Linux server with at least 512MB RAM",
    version: "1.22.1",
    popular: true,
  },
  // Other software details would be defined here
}

export default function InstallPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [serverDetails, setServerDetails] = useState({
    name: "",
    ip: "",
    sshPort: "22",
    username: "",
    sshKeyAdded: false,
  })

  const software = softwareDetails[Number(params.id) as keyof typeof softwareDetails]

  if (!software) {
    return <div>Software not found</div>
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate form
    if (!serverDetails.name || !serverDetails.ip || !serverDetails.username || !serverDetails.sshKeyAdded) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and confirm SSH key has been added.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // In a real app, this would send the installation request to the backend
    toast({
      title: "Installation Started",
      description: `Installing ${software.name} on ${serverDetails.name} (${serverDetails.ip})`,
    })

    // Redirect to dashboard after a short delay
    setTimeout(() => {
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="flex items-center gap-2 font-semibold mr-4">
            <div className="bg-gradient-to-r from-primary to-primary/70 p-1.5 rounded-md text-primary-foreground">
              <Server className="h-5 w-5" />
            </div>
            <span className="text-xl">ServerSoft</span>
          </div>
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </header>
      <main className="flex-1 bg-muted/10">
        <div className="container py-8">
          <div className="mb-8">
            <Link
              href="/catalog"
              className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Catalog
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Install {software.name}</h1>
            <p className="text-muted-foreground">Configure your server details to install {software.name}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <form onSubmit={handleSubmit}>
                <Card className="border-primary/10 shadow-lg">
                  <CardHeader className="bg-muted/30 border-b border-border/50">
                    <CardTitle>Server Details</CardTitle>
                    <CardDescription>
                      Enter the details of the server where you want to install {software.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2">
                      <Label htmlFor="server-name">Server Name</Label>
                      <Input
                        id="server-name"
                        placeholder="e.g., Production Web Server"
                        value={serverDetails.name}
                        onChange={(e) => setServerDetails({ ...serverDetails, name: e.target.value })}
                        className="rounded-md border-primary/20 focus-visible:ring-primary/30"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="server-ip">Server IP Address</Label>
                      <Input
                        id="server-ip"
                        placeholder="e.g., 192.168.1.1"
                        value={serverDetails.ip}
                        onChange={(e) => setServerDetails({ ...serverDetails, ip: e.target.value })}
                        className="rounded-md border-primary/20 focus-visible:ring-primary/30"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ssh-port">SSH Port</Label>
                      <Input
                        id="ssh-port"
                        placeholder="22"
                        value={serverDetails.sshPort}
                        onChange={(e) => setServerDetails({ ...serverDetails, sshPort: e.target.value })}
                        className="rounded-md border-primary/20 focus-visible:ring-primary/30"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">SSH Username</Label>
                      <Input
                        id="username"
                        placeholder="e.g., root"
                        value={serverDetails.username}
                        onChange={(e) => setServerDetails({ ...serverDetails, username: e.target.value })}
                        className="rounded-md border-primary/20 focus-visible:ring-primary/30"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ssh-key">SSH Key Confirmation</Label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="ssh-key"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          checked={serverDetails.sshKeyAdded}
                          onChange={(e) => setServerDetails({ ...serverDetails, sshKeyAdded: e.target.checked })}
                          required
                        />
                        <label htmlFor="ssh-key" className="text-sm text-muted-foreground">
                          I confirm that I have added the ServerSoft SSH public key to this server
                        </label>
                      </div>
                    </div>
                    <div className="pt-2">
                      <Label>Our SSH Public Key</Label>
                      <div className="mt-1.5 relative">
                        <Textarea
                          readOnly
                          className="font-mono text-xs h-24 bg-muted/30 border-primary/20"
                          value="ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC0pA4vzGH+PuCj8bRFSS/xZsOyuhs5u0yI9JOiGb7fcYUYOLMWIzn8+9BpXndrIV1KHm5lbLhYmNQZ9Ww9p2zj/ho0r+9cPxYsAUV+5qbhFfN8XdJB6ofYGt1quHUr1UBuL6KxEpWUEpfGRDGEj4jAk7HYOD8Cz4uJqxMbGYF/Tqg+QdaHhtSEYZBYONZBXPDq+dTl0c9QnSPa3X1YQKPwZXo5lBgArYYy2RNlKXwjXQtN4n9uNFQd7Meb5QnOqZXGmgT7/qYNYHFdYRLqTEIQkgH1oZ4fML8JR5PZ67XZG8PnfliKz4YXFqIZ1QQQyQXVJJLdGGNRri8wFKCLwPAB serversoft@example.com"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-2 hover:bg-primary/10"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC0pA4vzGH+PuCj8bRFSS/xZsOyuhs5u0yI9JOiGb7fcYUYOLMWIzn8+9BpXndrIV1KHm5lbLhYmNQZ9Ww9p2zj/ho0r+9cPxYsAUV+5qbhFfN8XdJB6ofYGt1quHUr1UBuL6KxEpWUEpfGRDGEj4jAk7HYOD8Cz4uJqxMbGYF/Tqg+QdaHhtSEYZBYONZBXPDq+dTl0c9QnSPa3X1YQKPwZXo5lBgArYYy2RNlKXwjXQtN4n9uNFQd7Meb5QnOqZXGmgT7/qYNYHFdYRLqTEIQkgH1oZ4fML8JR5PZ67XZG8PnfliKz4YXFqIZ1QQQyQXVJJLdGGNRri8wFKCLwPAB serversoft@example.com",
                            )
                            toast({
                              title: "Copied to clipboard",
                              description: "SSH public key has been copied to clipboard",
                            })
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Add this key to your server&apos;s ~/.ssh/authorized_keys file
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/30 border-t border-border/50">
                    <Button
                      type="submit"
                      className="w-full gap-2 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-md shadow-primary/20"
                      disabled={isLoading}
                    >
                      <Upload className="h-4 w-4" />
                      {isLoading ? "Installing..." : `Install ${software.name}`}
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </div>
            <div>
              <Card className="border-primary/10 shadow-lg overflow-hidden">
                <CardHeader className="bg-muted/30 border-b border-border/50">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-muted/80 to-muted/30 p-2 rounded-md border border-border/50 shadow-sm">
                      <Image
                        src={software.image || "/placeholder.svg"}
                        alt={software.name}
                        width={60}
                        height={60}
                        className="rounded-sm"
                      />
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {software.name}
                        {software.popular && (
                          <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary hover:bg-primary/20">
                            Popular
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>Version {software.version}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div>
                    <h3 className="font-medium mb-1 flex items-center gap-2">
                      <Info className="h-4 w-4 text-primary" />
                      Description
                    </h3>
                    <p className="text-sm text-muted-foreground">{software.longDescription}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-primary" />
                      System Requirements
                    </h3>
                    <p className="text-sm text-muted-foreground">{software.requirements}</p>
                  </div>
                  <div className="pt-2">
                    <h3 className="font-medium mb-1 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Installation Steps
                    </h3>
                    <ol className="text-sm text-muted-foreground space-y-2 pl-5 list-decimal">
                      <li>Enter your server details</li>
                      <li>Add our SSH key to your server</li>
                      <li>Click Install to begin the installation process</li>
                      <li>Monitor the installation progress in the dashboard</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
