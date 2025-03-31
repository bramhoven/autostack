"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { createServer } from "@/lib/actions/servers"

export function ServerForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [serverDetails, setServerDetails] = useState({
    name: "",
    ip_address: "",
    ssh_port: "22",
    username: "",
    monitoring_enabled: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate form
      if (!serverDetails.name || !serverDetails.ip_address || !serverDetails.username) {
        throw new Error("Please fill in all required fields")
      }

      // Create server
      await createServer({
        name: serverDetails.name,
        ip_address: serverDetails.ip_address,
        ssh_port: serverDetails.ssh_port,
        username: serverDetails.username,
        status: "online",
        // Add monitoring data if enabled
        ...(serverDetails.monitoring_enabled && {
          uptime: "100%",
          load: "0%",
          disk: "0%",
          memory: "0%",
        }),
      })

      toast({
        title: "Server Added",
        description: `Server ${serverDetails.name} has been added successfully.`,
      })

      // Redirect to servers page
      router.push("/servers")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add server. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopySSHKey = () => {
    navigator.clipboard.writeText(
      "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC0pA4vzGH+PuCj8bRFSS/xZsOyuhs5u0yI9JOiGb7fcYUYOLMWIzn8+9BpXndrIV1KHm5lbLhYmNQZ9Ww9p2zj/ho0r+9cPxYsAUV+5qbhFfN8XdJB6ofYGt1quHUr1UBuL6KxEpWUEpfGRDGEj4jAk7HYOD8Cz4uJqxMbGYF/Tqg+QdaHhtSEYZBYONZBXPDq+dTl0c9QnSPa3X1YQKPwZXo5lBgArYYy2RNlKXwjXQtN4n9uNFQd7Meb5QnOqZXGmgT7/qYNYHFdYRLqTEIQkgH1oZ4fML8JR5PZ67XZG8PnfliKz4YXFqIZ1QQQyQXVJJLdGGNRri8wFKCLwPAB serversoft@example.com",
    )
    toast({
      title: "Copied to clipboard",
      description: "SSH public key has been copied to clipboard",
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="border-primary/10 shadow-lg">
        <CardHeader className="bg-muted/30 border-b border-border/50">
          <CardTitle>Server Details</CardTitle>
          <CardDescription>Enter the details of the server you want to add to your account</CardDescription>
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
              value={serverDetails.ip_address}
              onChange={(e) => setServerDetails({ ...serverDetails, ip_address: e.target.value })}
              className="rounded-md border-primary/20 focus-visible:ring-primary/30"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ssh-port">SSH Port</Label>
            <Input
              id="ssh-port"
              placeholder="22"
              value={serverDetails.ssh_port}
              onChange={(e) => setServerDetails({ ...serverDetails, ssh_port: e.target.value })}
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
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="monitoring" className="cursor-pointer">
                Enable Monitoring
              </Label>
              <Switch
                id="monitoring"
                checked={serverDetails.monitoring_enabled}
                onCheckedChange={(checked) => setServerDetails({ ...serverDetails, monitoring_enabled: checked })}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Monitoring collects data about CPU, memory, disk usage, and uptime
            </p>
          </div>
          <div className="pt-2">
            <Label>SSH Key Setup</Label>
            <div className="mt-1.5 relative">
              <div className="font-mono text-xs h-24 bg-muted/30 border-primary/20 p-3 rounded-md overflow-auto">
                ssh-rsa
                AAAAB3NzaC1yc2EAAAADAQABAAABAQC0pA4vzGH+PuCj8bRFSS/xZsOyuhs5u0yI9JOiGb7fcYUYOLMWIzn8+9BpXndrIV1KHm5lbLhYmNQZ9Ww9p2zj/ho0r+9cPxYsAUV+5qbhFfN8XdJB6ofYGt1quHUr1UBuL6KxEpWUEpfGRDGEj4jAk7HYOD8Cz4uJqxMbGYF/Tqg+QdaHhtSEYZBYONZBXPDq+dTl0c9QnSPa3X1YQKPwZXo5lBgArYYy2RNlKXwjXQtN4n9uNFQd7Meb5QnOqZXGmgT7/qYNYHFdYRLqTEIQkgH1oZ4fML8JR5PZ67XZG8PnfliKz4YXFqIZ1QQQyQXVJJLdGGNRri8wFKCLwPAB
                serversoft@example.com
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2 hover:bg-primary/10"
                onClick={handleCopySSHKey}
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
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Adding Server...
              </>
            ) : (
              "Add Server"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

