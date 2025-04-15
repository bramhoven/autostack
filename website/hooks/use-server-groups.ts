"use client"

import { useEffect, useState } from "react"
import { getServerGroups, getUnassignedServers, type ServerGroup } from "@/lib/actions/settings"

export function useServerGroups() {
  const [groups, setGroups] = useState<ServerGroup[]>([])
  const [unassignedServers, setUnassignedServers] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        const [groupsData, unassignedData] = await Promise.all([getServerGroups(), getUnassignedServers()])
        setGroups(groupsData || [])
        setUnassignedServers(unassignedData || [])
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch server groups"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return {
    groups,
    setGroups,
    unassignedServers,
    setUnassignedServers,
    isLoading,
    error,
  }
}
