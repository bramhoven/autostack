"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { getServers, deleteServer } from "@/lib/actions/servers"
import type { Server } from "@/lib/actions/servers"

export function useServers() {
  const { toast } = useToast()
  const [servers, setServers] = useState<Server[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchServers = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getServers()
      setServers(data)
    } catch (error: any) {
      setError(error.message || "Failed to load servers")
      toast({
        title: "Error",
        description: error.message || "Failed to load servers",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteServer = async (id: number) => {
    setIsDeleting(true)
    try {
      await deleteServer(id)
      setServers(servers.filter((server) => server.id !== id))
      toast({
        title: "Server Deleted",
        description: "The server has been successfully removed.",
      })
      return true
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete server",
        variant: "destructive",
      })
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  useEffect(() => {
    fetchServers()
  }, [])

  return {
    servers,
    isLoading,
    error,
    isDeleting,
    fetchServers,
    deleteServer: handleDeleteServer,
  }
}
