"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import {
  Server,
  MoreVertical,
  RefreshCw,
  Trash2,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Loader2,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth/auth-provider"

// Mock data for installed software
const installedSoftware = [
  {
    id: 1,
    name: "Nginx",
    server: "Web Server 1",
    serverIp: "192.168.1.100",
    version: "1.22.1",
    status: "running",
    installedAt: "2023-12-10T14:30:00Z",
    image: "/placeholder.svg?height=80&width=80",
    uptime: "99.9%",
    memory: "128MB",
    cpu: "2%",
  },
  {
    id: 2,
    name: "PostgreSQL",
    server: "Database Server",
    serverIp: "192.168.1.101",
    version: "14.5",
    status: "running",
    installedAt: "2023-12-15T09:45:00Z",
    image: "/placeholder.svg?height=80&width=80",
    uptime: "99.8%",
    memory: "512MB",
    cpu: "15%",
  },
  {
    id: 3,
    name: "Redis",
    server: "Cache Server",
    serverIp: "192.168.1.102",
    version: "7.0.5",
    status: "running",
    installedAt: "2023-12-18T11:20:00Z",
    image: "/placeholder.svg?height=80&width=80",
    uptime: "100%",
    memory: "256MB",
    cpu: "5%",
  },
  {
    id: 4,
    name: "MongoDB",
    server: "Database Server",
    serverIp: "192.168.1.101",
    version: "6.0.3",
    status: "stopped",
    installedAt: "2024-01-05T16:15:00Z",
    image: "/placeholder.svg?height=80&width=80",
    uptime: "0%",
    memory: "0MB",
    cpu: "0%",
  },
]

// Mock data for servers
const servers = [
  {
    id: 1,
    name: "Web Server 1",
    ip: "192.168.1.100",
    status: "online",
    softwareCount: 2,
    uptime: "99.9%",
    load: "15%",
    disk: "45%",
    memory: "30%",
  },
  {
    id: 2,
    name: "Database Server",
    ip: "192.168.1.101",
    status: "online",
    softwareCount: 3,
    uptime: "99.7%",
    load: "35%",
    disk: "65%",
    memory: "70%",
  },
  {
    id: 3,
    name: "Cache Server",
    ip: "192.168.1.102",
    status: "online",
    softwareCount: 1,
    uptime: "100%",
    load: "10%",
    disk: "25%",
    memory: "40%",
  },
]

export default function DashboardPage() {
  const { toast } = useToast()
  const [installations, setInstallations] = useState(installedSoftware)
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  // If still loading or no user, show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const handleUpdateSoftware = (id: number) => {
    toast({
      title: "Update Started",
      description: "Software update has been initiated. This may take a few minutes.",
    })
  }

  const handleDeleteSoftware = (id: number) => {
    setInstallations(installations.filter((software) => software.id !== id))
    setConfirmDelete(null)
    toast({
      title: "Software Removed",
      description: "The software has been successfully uninstalled.",
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "text-green-500"
      case "stopped":
        return "text-red-500"
      default:
        return "text-yellow-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "stopped":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
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
          <div className="relative mb-10 overflow-hidden rounded-xl border bg-background p-8 shadow-lg">
            <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rotate-12 bg-primary/10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-64 w-64 -rotate-12 bg-primary/10 blur-3xl"></div>
            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Manage your servers and installed software.</p>
              </div>
              <Link href="/catalog">
                <Button className="rounded-full px-6 gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-md shadow-primary/20">
                  <Plus className="h-4 w-4" />
                  Install New Software
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-background to-primary/5 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Servers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{servers.length}</div>
                <p className="text-xs text-muted-foreground mt-1">All servers operational</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-background to-primary/5 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Software Installations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{installations.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {installations.filter((s) => s.status === "running").length} running,{" "}
                  {installations.filter((s) => s.status !== "running").length} stopped
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-background to-primary/5 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">98.7%</div>
                <p className="text-xs text-muted-foreground mt-1">Average uptime across all systems</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="installations" className="mb-8">
            <TabsList className="bg-muted/50 p-1 rounded-full">
              <TabsTrigger value="installations" className="rounded-full">
                Installations
              </TabsTrigger>
              <TabsTrigger value="servers" className="rounded-full">
                Servers
              </TabsTrigger>
            </TabsList>
            <TabsContent value="installations" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {installations.map((software) => (
                  <Card
                    key={software.id}
                    className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-primary/10 hover:border-primary/30"
                  >
                    <CardHeader className="flex flex-row items-center gap-4 pb-2 bg-muted/30">
                      <div className="bg-gradient-to-br from-muted/80 to-muted/30 p-2 rounded-md border border-border/50 shadow-sm">
                        <Image
                          src={software.image || "/placeholder.svg"}
                          alt={software.name}
                          width={50}
                          height={50}
                          className="rounded-sm"
                        />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="flex items-center justify-between">
                          {software.name}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem
                                onClick={() => handleUpdateSoftware(software.id)}
                                className="cursor-pointer"
                              >
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Update
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive cursor-pointer"
                                onClick={() => setConfirmDelete(software.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Uninstall
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </CardTitle>
                        <CardDescription>Version {software.version}</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Status:</span>
                          <Badge
                            variant="outline"
                            className={`flex items-center gap-1 ${getStatusColor(software.status)}`}
                          >
                            {getStatusIcon(software.status)}
                            <span>{software.status.charAt(0).toUpperCase() + software.status.slice(1)}</span>
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Server:</span>
                          <span className="font-medium">{software.server}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">IP Address:</span>
                          <span className="font-mono text-xs bg-muted/50 px-2 py-0.5 rounded">{software.serverIp}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Installed:</span>
                          <span>{formatDate(software.installedAt)}</span>
                        </div>
                        {software.status === "running" && (
                          <>
                            <div className="pt-2">
                              <div className="flex justify-between mb-1">
                                <span className="text-xs text-muted-foreground">CPU Usage</span>
                                <span className="text-xs font-medium">{software.cpu}</span>
                              </div>
                              <Progress value={Number.parseInt(software.cpu)} className="h-1.5" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-xs text-muted-foreground">Memory Usage</span>
                                <span className="text-xs font-medium">{software.memory}</span>
                              </div>
                              <Progress value={Number.parseInt(software.memory) / 10} className="h-1.5" />
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="bg-muted/30 border-t border-border/50">
                      <Button
                        variant={software.status === "running" ? "outline" : "default"}
                        className="w-full rounded-full"
                      >
                        {software.status === "running" ? "Stop" : "Start"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {installations.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-muted/30 p-6 rounded-full mb-4">
                    <Server className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-lg font-medium">No software installed</h3>
                  <p className="text-muted-foreground mb-4 max-w-md">
                    You haven&apos;t installed any software yet. Browse our catalog to get started.
                  </p>
                  <Link href="/catalog">
                    <Button className="rounded-full px-8 gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300">
                      <Plus className="h-4 w-4" />
                      Browse Software Catalog
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>
            <TabsContent value="servers" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {servers.map((server) => (
                  <Card
                    key={server.id}
                    className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-primary/10 hover:border-primary/30"
                  >
                    <CardHeader className="bg-muted/30">
                      <div className="flex justify-between items-center">
                        <CardTitle>{server.name}</CardTitle>
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                          Online
                        </Badge>
                      </div>
                      <CardDescription className="font-mono text-xs">{server.ip}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Uptime:</span>
                          <span className="font-medium">{server.uptime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Software Installed:</span>
                          <span className="font-medium">{server.softwareCount}</span>
                        </div>
                        <div className="pt-2">
                          <div className="flex justify-between mb-1">
                            <span className="text-xs text-muted-foreground">CPU Load</span>
                            <span className="text-xs font-medium">{server.load}</span>
                          </div>
                          <Progress value={Number.parseInt(server.load)} className="h-1.5" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-xs text-muted-foreground">Memory Usage</span>
                            <span className="text-xs font-medium">{server.memory}</span>
                          </div>
                          <Progress value={Number.parseInt(server.memory)} className="h-1.5" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-xs text-muted-foreground">Disk Usage</span>
                            <span className="text-xs font-medium">{server.disk}</span>
                          </div>
                          <Progress value={Number.parseInt(server.disk)} className="h-1.5" />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between bg-muted/30 border-t border-border/50">
                      <Button variant="outline" size="sm" className="rounded-full">
                        Details
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-full">
                        Manage
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Dialog open={confirmDelete !== null} onOpenChange={(open) => !open && setConfirmDelete(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Confirm Uninstallation
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to uninstall this software? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmDelete(null)} className="rounded-full">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => confirmDelete && handleDeleteSoftware(confirmDelete)}
              className="rounded-full"
            >
              Uninstall
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

