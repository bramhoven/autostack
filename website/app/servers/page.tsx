"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { PageHeader } from "@/components/ui/page-header"
import { ServerCard } from "@/components/servers/server-card"
import { EmptyState } from "@/components/ui/empty-state"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useServers } from "@/hooks/use-servers"
import { useInstallations } from "@/hooks/use-installations"
import { ServerIcon, Plus, Loader2, AlertCircle } from "lucide-react"

export default function ServersPage() {
  const { servers, isLoading, error, isDeleting, deleteServer } = useServers()
  const { installations } = useInstallations()
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)

  // Get software count for each server
  const getSoftwareCount = (serverId: number) => {
    return installations.filter((installation) => installation.server_id === serverId).length
  }

  const handleDeleteServer = async () => {
    if (confirmDelete) {
      await deleteServer(confirmDelete)
    }
  }

  return (
    <DashboardLayout>
      <div className="container py-8">
        <PageHeader title="Servers" description="Manage your servers and view their status">
          <Link href="/servers/add">
            <Button className="rounded-full px-6 gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-md shadow-primary/20">
              <Plus className="h-4 w-4" />
              Add New Server
            </Button>
          </Link>
        </PageHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center gap-2 text-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <h3 className="font-medium">Failed to load servers</h3>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        ) : servers.length === 0 ? (
          <EmptyState
            icon={<ServerIcon className="h-12 w-12 text-muted-foreground/50" />}
            title="No servers added"
            description="You haven't added any servers yet. Add your first server to get started."
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
      </div>

      <ConfirmDialog
        open={confirmDelete !== null}
        onOpenChange={(open) => !open && setConfirmDelete(null)}
        title="Confirm Server Removal"
        description="Are you sure you want to remove this server? All installed software will be uninstalled."
        confirmLabel="Remove Server"
        onConfirm={handleDeleteServer}
        isLoading={isDeleting}
        variant="destructive"
      />
    </DashboardLayout>
  )
}
