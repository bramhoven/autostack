"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { InstallationCard } from "@/components/installations/installation-card"
import { useInstallations } from "@/hooks/use-installations"
import { useSoftware } from "@/hooks/use-software"
import { useServers } from "@/hooks/use-servers"
import { formatDate } from "@/lib/utils/format"
import { Plus, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface ServerInstallationsProps {
  serverId: number
}

export function ServerInstallations({ serverId }: ServerInstallationsProps) {
  const router = useRouter()
  const { installations, isLoading: installationsLoading, deleteInstallation, toggleStatus } = useInstallations()
  const { software, isLoading: softwareLoading } = useSoftware()
  const { servers, isLoading: serversLoading } = useServers()
  const [serverInstallations, setServerInstallations] = useState<any[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)

  const isLoading = installationsLoading || softwareLoading || serversLoading

  useEffect(() => {
    if (!isLoading && installations) {
      const filtered = installations.filter((installation) => installation && installation.server_id === serverId)
      setServerInstallations(filtered)
    }
  }, [installations, serverId, isLoading])

  const handleAddInstallation = () => {
    router.push(`/software/install?server=${serverId}`)
  }

  const handleDeleteInstallation = async (id: number) => {
    try {
      setIsProcessing(true)
      await deleteInstallation(id)
      setServerInstallations((prev) => prev.filter((installation) => installation.id !== id))
    } catch (error) {
      console.error("Error deleting installation:", error)
    } finally {
      setIsProcessing(false)
      setConfirmDelete(null)
    }
  }

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    try {
      setIsProcessing(true)
      await toggleStatus(id, currentStatus)
      setServerInstallations((prev) =>
        prev.map((installation) =>
          installation.id === id
            ? { ...installation, status: currentStatus === "running" ? "stopped" : "running" }
            : installation,
        ),
      )
    } catch (error) {
      console.error("Error toggling status:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!serverInstallations || serverInstallations.length === 0) {
    return (
      <EmptyState
        icon={<Plus className="h-12 w-12 text-muted-foreground/50" />}
        title="No installations found"
        description="This server doesn't have any software installed yet."
        actionLabel="Install Software"
        actionLink={`/software/install?server=${serverId}`}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Installed Software</h2>
        <Button onClick={handleAddInstallation}>
          <Plus className="h-4 w-4 mr-2" />
          Install Software
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {serverInstallations.map((installation) => {
          const softwareItem = software?.find((s) => s.id === installation.software_id) || {
            name: "Unknown Software",
            image_url: "/placeholder.svg?height=50&width=50",
            description: "",
            category: "",
            version: "Unknown",
          }

          const serverItem = servers?.find((s) => s.id === installation.server_id) || {
            name: "Unknown Server",
            ip_address: "Unknown",
            status: "unknown",
          }

          return (
            <InstallationCard
              key={installation.id}
              installation={installation}
              software={softwareItem}
              server={serverItem}
              onUpdate={() => {}}
              onDelete={(id) => setConfirmDelete(id)}
              onToggleStatus={handleToggleStatus}
              formatDate={formatDate}
            />
          )
        })}
      </div>
    </div>
  )
}

