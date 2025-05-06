"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, CloudIcon, Server } from "lucide-react"
import { createServer } from "@/lib/actions/servers"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCloudProviderCredentials, useCloudProviderCredential } from "@/hooks/use-cloud-providers"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EmptyState } from "@/components/ui/empty-state"
import Link from "next/link"

export function ServerForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const providerId = searchParams.get("provider")
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [serverType, setServerType] = useState<"manual" | "cloud">("manual")
  const { credentials } = useCloudProviderCredentials()
  const [selectedCredentialId, setSelectedCredentialId] = useState<string | null>(providerId)
  const { credential } = useCloudProviderCredential(selectedCredentialId || "")

  const [serverDetails, setServerDetails] = useState({
    name: "",
    ip_address: "",
    ssh_port: "22",
    username: "",
    monitoring_enabled: true,
  })

  const [cloudServerDetails, setCloudServerDetails] = useState({
    name: "",
    region: "",
    size: "",
    image: "",
    monitoring_enabled: true,
  })

  // Set the server type based on the provider query param
  useEffect(() => {
    if (providerId) {
      setServerType("cloud")
    }
  }, [providerId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (serverType === "manual") {
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
      } else {
        // Cloud server creation
        if (
          !selectedCredentialId ||
          !cloudServerDetails.name ||
          !cloudServerDetails.region ||
          !cloudServerDetails.size ||
          !cloudServerDetails.image
        ) {
          throw new Error("Please fill in all required fields")
        }

        // In a real implementation, this would call a server action to create a server in the cloud
        // For now, we'll simulate it by creating a server record
        await createServer({
          name: cloudServerDetails.name,
          ip_address: "Provisioning...",
          ssh_port: "22",
          username: "root", // Default for most cloud providers
          status: "provisioning",
          // Add monitoring data if enabled
          ...(cloudServerDetails.monitoring_enabled && {
            uptime: "0%",
            load: "0%",
            disk: "0%",
            memory: "0%",
          }),
        })

        toast({
          title: "Server Creation Started",
          description: `Server ${cloudServerDetails.name} is being provisioned. This may take a few minutes.`,
        })
      }

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

  // Get available regions, sizes, and images based on the selected provider
  const getRegions = () => {
    if (!credential) return []

    // In a real implementation, this would fetch regions from the cloud provider API
    // For now, we'll return some sample data based on the provider
    if (credential.cloud_providers?.slug === "aws") {
      return [
        { id: "us-east-1", name: "US East (N. Virginia)" },
        { id: "us-west-1", name: "US West (N. California)" },
        { id: "eu-west-1", name: "EU (Ireland)" },
        { id: "ap-southeast-1", name: "Asia Pacific (Singapore)" },
      ]
    } else if (credential.cloud_providers?.slug === "digitalocean") {
      return [
        { id: "nyc1", name: "New York 1" },
        { id: "sfo2", name: "San Francisco 2" },
        { id: "ams3", name: "Amsterdam 3" },
        { id: "sgp1", name: "Singapore 1" },
      ]
    } else {
      return [
        { id: "region-1", name: "Region 1" },
        { id: "region-2", name: "Region 2" },
      ]
    }
  }

  const getSizes = () => {
    if (!credential) return []

    // In a real implementation, this would fetch sizes from the cloud provider API
    // For now, we'll return some sample data based on the provider
    if (credential.cloud_providers?.slug === "aws") {
      return [
        { id: "t2.micro", name: "t2.micro (1 vCPU, 1 GB RAM)" },
        { id: "t2.small", name: "t2.small (1 vCPU, 2 GB RAM)" },
        { id: "t2.medium", name: "t2.medium (2 vCPU, 4 GB RAM)" },
        { id: "t2.large", name: "t2.large (2 vCPU, 8 GB RAM)" },
      ]
    } else if (credential.cloud_providers?.slug === "digitalocean") {
      return [
        { id: "s-1vcpu-1gb", name: "Basic: 1 vCPU, 1 GB RAM" },
        { id: "s-1vcpu-2gb", name: "Basic: 1 vCPU, 2 GB RAM" },
        { id: "s-2vcpu-2gb", name: "Basic: 2 vCPU, 2 GB RAM" },
        { id: "s-2vcpu-4gb", name: "Basic: 2 vCPU, 4 GB RAM" },
      ]
    } else {
      return [
        { id: "small", name: "Small (1 vCPU, 1 GB RAM)" },
        { id: "medium", name: "Medium (2 vCPU, 2 GB RAM)" },
        { id: "large", name: "Large (4 vCPU, 4 GB RAM)" },
      ]
    }
  }

  const getImages = () => {
    if (!credential) return []

    // In a real implementation, this would fetch images from the cloud provider API
    // For now, we'll return some sample data based on the provider
    if (credential.cloud_providers?.slug === "aws") {
      return [
        { id: "ami-0c55b159cbfafe1f0", name: "Ubuntu 20.04 LTS" },
        { id: "ami-0b5eea76982371e91", name: "Amazon Linux 2" },
        { id: "ami-0c02fb55956c7d316", name: "Debian 11" },
        { id: "ami-0f9fc25dd2506cf6d", name: "CentOS 8" },
      ]
    } else if (credential.cloud_providers?.slug === "digitalocean") {
      return [
        { id: "ubuntu-20-04-x64", name: "Ubuntu 20.04 LTS" },
        { id: "debian-11-x64", name: "Debian 11" },
        { id: "centos-8-x64", name: "CentOS 8" },
        { id: "rockylinux-8-x64", name: "Rocky Linux 8" },
      ]
    } else {
      return [
        { id: "ubuntu-20-04", name: "Ubuntu 20.04 LTS" },
        { id: "debian-11", name: "Debian 11" },
        { id: "centos-8", name: "CentOS 8" },
      ]
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs
        value={serverType}
        onValueChange={(value) => setServerType(value as "manual" | "cloud")}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual" className="gap-2">
            <Server className="h-4 w-4" />
            Manual Setup
          </TabsTrigger>
          <TabsTrigger value="cloud" className="gap-2">
            <CloudIcon className="h-4 w-4" />
            Cloud Provider
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manual">
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
        </TabsContent>

        <TabsContent value="cloud">
          {!credentials || credentials.length === 0 ? (
            <EmptyState
              icon={<CloudIcon className="h-12 w-12" />}
              title="No cloud provider credentials"
              description="Add your cloud provider credentials to create servers"
              action={
                <Link href="/cloud-providers/add">
                  <Button className="gap-1.5">Add Cloud Provider</Button>
                </Link>
              }
            />
          ) : (
            <Card className="border-primary/10 shadow-lg">
              <CardHeader className="bg-muted/30 border-b border-border/50">
                <CardTitle>Cloud Server Details</CardTitle>
                <CardDescription>Create a new server using your cloud provider</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="credential">Cloud Provider</Label>
                  <Select value={selectedCredentialId || ""} onValueChange={(value) => setSelectedCredentialId(value)}>
                    <SelectTrigger className="rounded-md border-primary/20 focus-visible:ring-primary/30">
                      <SelectValue placeholder="Select a cloud provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {credentials.map((cred) => (
                        <SelectItem key={cred.id} value={cred.id}>
                          {cred.name} ({cred.cloud_providers?.name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedCredentialId && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="server-name">Server Name</Label>
                      <Input
                        id="server-name"
                        placeholder="e.g., Production Web Server"
                        value={cloudServerDetails.name}
                        onChange={(e) => setCloudServerDetails({ ...cloudServerDetails, name: e.target.value })}
                        className="rounded-md border-primary/20 focus-visible:ring-primary/30"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="region">Region</Label>
                      <Select
                        value={cloudServerDetails.region}
                        onValueChange={(value) => setCloudServerDetails({ ...cloudServerDetails, region: value })}
                      >
                        <SelectTrigger className="rounded-md border-primary/20 focus-visible:ring-primary/30">
                          <SelectValue placeholder="Select a region" />
                        </SelectTrigger>
                        <SelectContent>
                          {getRegions().map((region) => (
                            <SelectItem key={region.id} value={region.id}>
                              {region.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="size">Server Size</Label>
                      <Select
                        value={cloudServerDetails.size}
                        onValueChange={(value) => setCloudServerDetails({ ...cloudServerDetails, size: value })}
                      >
                        <SelectTrigger className="rounded-md border-primary/20 focus-visible:ring-primary/30">
                          <SelectValue placeholder="Select a size" />
                        </SelectTrigger>
                        <SelectContent>
                          {getSizes().map((size) => (
                            <SelectItem key={size.id} value={size.id}>
                              {size.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image">Operating System</Label>
                      <Select
                        value={cloudServerDetails.image}
                        onValueChange={(value) => setCloudServerDetails({ ...cloudServerDetails, image: value })}
                      >
                        <SelectTrigger className="rounded-md border-primary/20 focus-visible:ring-primary/30">
                          <SelectValue placeholder="Select an operating system" />
                        </SelectTrigger>
                        <SelectContent>
                          {getImages().map((image) => (
                            <SelectItem key={image.id} value={image.id}>
                              {image.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="cloud-monitoring" className="cursor-pointer">
                          Enable Monitoring
                        </Label>
                        <Switch
                          id="cloud-monitoring"
                          checked={cloudServerDetails.monitoring_enabled}
                          onCheckedChange={(checked) =>
                            setCloudServerDetails({ ...cloudServerDetails, monitoring_enabled: checked })
                          }
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Monitoring collects data about CPU, memory, disk usage, and uptime
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter className="bg-muted/30 border-t border-border/50">
                <Button
                  type="submit"
                  className="w-full gap-2 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-md shadow-primary/20"
                  disabled={isLoading || !selectedCredentialId}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating Server...
                    </>
                  ) : (
                    "Create Server"
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </form>
  )
}
