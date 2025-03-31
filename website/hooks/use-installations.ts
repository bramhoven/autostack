"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import {
  getInstallations,
  deleteInstallation,
  updateInstallationStatus,
  createInstallation,
} from "@/lib/actions/installations"

export function useInstallations() {
  const { toast } = useToast()
  const [installations, setInstallations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const fetchInstallations = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getInstallations()
      setInstallations(data || [])
    } catch (error: any) {
      setError(error.message || "Failed to load installations")
      toast({
        title: "Error",
        description: error.message || "Failed to load installations",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteInstallation = async (id: number) => {
    setIsProcessing(true)
    try {
      await deleteInstallation(id)
      setInstallations(installations.filter((installation) => installation.id !== id))
      toast({
        title: "Software Removed",
        description: "The software has been successfully uninstalled.",
      })
      return true
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to uninstall software",
        variant: "destructive",
      })
      return false
    } finally {
      setIsProcessing(false)
    }
  }

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    setIsProcessing(true)
    const newStatus = currentStatus === "running" ? "stopped" : "running"
    try {
      await updateInstallationStatus(id, newStatus)
      setInstallations(
        installations.map((installation) =>
          installation.id === id ? { ...installation, status: newStatus } : installation,
        ),
      )
      toast({
        title: `Software ${newStatus === "running" ? "Started" : "Stopped"}`,
        description: `The software has been ${newStatus === "running" ? "started" : "stopped"} successfully.`,
      })
      return true
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${newStatus === "running" ? "start" : "stop"} software`,
        variant: "destructive",
      })
      return false
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCreateInstallation = async (data: { server_id: number; software_id: number; version: string }) => {
    setIsProcessing(true)
    try {
      const newInstallation = await createInstallation(data)
      setInstallations([...installations, newInstallation])
      toast({
        title: "Installation Started",
        description: "Software installation has been initiated. You can monitor progress in the dashboard.",
      })
      return true
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to install software",
        variant: "destructive",
      })
      return false
    } finally {
      setIsProcessing(false)
    }
  }

  useEffect(() => {
    fetchInstallations()
  }, [])

  return {
    installations,
    isLoading,
    error,
    isProcessing,
    fetchInstallations,
    deleteInstallation: handleDeleteInstallation,
    toggleStatus: handleToggleStatus,
    createInstallation: handleCreateInstallation,
  }
}

