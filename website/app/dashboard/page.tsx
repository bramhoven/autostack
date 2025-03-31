"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { PageHeader } from "@/components/ui/page-header"
import { EmptyState } from "@/components/ui/empty-state"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { InstallationCard } from "@/components/installations/installation-card"
import { ServerCard } from "@/components/servers/server-card"
import { useServers } from "@/hooks/use-servers"
import { useInstallations } from "@/hooks/use-installations"
import { useSoftware } from "@/hooks/use-software"
import { formatDate } from "@/lib/utils/format"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth/auth-provider"
import { Server, Plus, Loader2 } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const { servers, isLoading: serversLoading } = useServers()
  const { software, isLoading: softwareLoading } = useSoftware()
  const {
    installations,
    isLoading: installationsLoading,
    isProcessing,
    deleteInstallation,
    toggleStatus,
  } = useInstallations()
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)
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
  }, [router, supabase])

  // If still loading or no user, show loading state
  if (authLoading || serversLoading || softwareLoading || installationsLoading) {
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
    // Implementation for software update
  }

  const handleDeleteSoftware = async () => {
    if (confirmDelete) {
      await deleteInstallation(confirmDelete)
    }
  }

  // Get software count for each server
  const getSoftwareCount = (serverId: number) => {
    return installations.filter((installation) => installation.server_id === serverId).length
  }

  // Find software and server details for an installation
  const getSoftwareDetails = (softwareId: number) => {
    return software.find((s) => s.id === softwareId) || { name: "Unknown", image_url: "/placeholder.svg" }
  }

  const getServerDetails = (serverId: number) => {
    return servers.find((s) => s.id === serverId) || { name: "Unknown", ip_address: "Unknown" }
  }

  return (
    <DashboardLayout>
      <div className="container py-8">
        <PageHeader title="Dashboard" description="Manage your servers and installed software.">
          <div className="flex gap-3">
            <Link href="/servers/add">
              <Button className="rounded-full px-6 gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-md shadow-primary/20">
                <Plus className="h-4 w-4" />
                Add Server
              </Button>
            </Link>
            <Link href="/software/install">
              <Button className="rounded-full px-6 gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-md shadow-primary/20">
                <Plus className="h-4 w-4" />
                Install Software
              </Button>
            </Link>
          </div>
        </PageHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-background to-primary/5 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Servers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{servers.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {servers.filter((s) => s.status === "online").length} online,{" "}
                {servers.filter((s) => s.status !== "online").length} offline
              </p>
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
              <div className="text-3xl font-bold">
                {servers.length > 0
                  ? `${Math.round((servers.filter((s) => s.status === "online").length / servers.length) * 100)}%`
                  : "N/A"}
              </div>
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
            {installations.length === 0 ? (
              <EmptyState
                icon={<Server className="h-12 w-12 text-muted-foreground/50" />}
                title="No software installed"
                description="You haven't installed any software yet. Browse our catalog to get started."
                actionLabel="Install Software"
                actionLink="/software/install"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {installations.map((installation) => {
                  const softwareDetails = getSoftwareDetails(installation.software_id)
                  const serverDetails = getServerDetails(installation.server_id)

                  return (
                    <InstallationCard
                      key={installation.id}
                      installation={installation}
                      software={softwareDetails}
                      server={serverDetails}
                      onUpdate={handleUpdateSoftware}
                      onDelete={(id) => setConfirmDelete(id)}
                      onToggleStatus={toggleStatus}
                      formatDate={formatDate}
                    />
                  )
                })}
              </div>
            )}
          </TabsContent>
          <TabsContent value="servers" className="mt-6">
            {servers.length === 0 ? (
              <EmptyState
                icon={<Server className="h-12 w-12 text-muted-foreground/50" />}
                title="No servers added"
                description="You haven't added any servers yet. Add a server to get started."
                actionLabel="Add New Server"
                actionLink="/servers/add"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {servers.map((server) => (
                  <ServerCard
                    key={server.id}
                    server={server}
                    softwareCount={getSoftwareCount(server.id)}
                    onDelete={(id) => setConfirmDelete(id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <ConfirmDialog
        open={confirmDelete !== null}
        onOpenChange={(open) => !open && setConfirmDelete(null)}
        title="Confirm Uninstallation"
        description="Are you sure you want to uninstall this software? This action cannot be undone."
        confirmLabel="Uninstall"
        onConfirm={handleDeleteSoftware}
        isLoading={isProcessing}
        variant="destructive"
      />
    </DashboardLayout>
  )
}

