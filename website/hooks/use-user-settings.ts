"use client"

import { useEffect, useState } from "react"
import { getUserSettings } from "@/lib/actions/settings"

// Define the UserSettings type to include notification settings
export interface UserSettings {
  theme: string
  auto_refresh: boolean
  refresh_interval: number
  show_offline_servers: boolean
  enable_notifications: boolean
  compact_view: boolean
  email_notifications?: boolean
  server_alerts?: boolean
  installation_updates?: boolean
  security_alerts?: boolean
  marketing_emails?: boolean
}

// Default settings to use as initial state
const defaultSettings: UserSettings = {
  theme: "system",
  auto_refresh: true,
  refresh_interval: 30,
  show_offline_servers: true,
  enable_notifications: true,
  compact_view: false,
  email_notifications: true,
  server_alerts: true,
  installation_updates: true,
  security_alerts: true,
  marketing_emails: false,
}

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchSettings() {
      try {
        setIsLoading(true)
        const data = await getUserSettings()
        setSettings({
          ...defaultSettings,
          ...data,
        })
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch user settings"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [])

  return {
    settings,
    setSettings,
    isLoading,
    error,
  }
}

