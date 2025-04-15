"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { getSoftware } from "@/lib/actions/software"
import type { Software } from "@/lib/actions/software"

export function useSoftware() {
  const { toast } = useToast()
  const [software, setSoftware] = useState<Software[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSoftware = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getSoftware()
      setSoftware(data)
    } catch (error: any) {
      setError(error.message || "Failed to load software")
      toast({
        title: "Error",
        description: error.message || "Failed to load software",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSoftware()
  }, [])

  return {
    software,
    isLoading,
    error,
    fetchSoftware,
  }
}
