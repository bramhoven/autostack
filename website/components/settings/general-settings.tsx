"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateGeneralSettings, type UserSettings } from "@/lib/actions/settings"
import { useUserSettings } from "@/hooks/use-user-settings"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

// Default settings to use for reset
const defaultSettings: UserSettings = {
  theme: "system",
  auto_refresh: true,
  refresh_interval: 30,
  show_offline_servers: true,
  enable_notifications: true,
  compact_view: false,
}

export function GeneralSettings() {
  const { toast } = useToast()
  const { settings: userSettings, isLoading, error } = useUserSettings()
  const [settings, setSettings] = useState<UserSettings>(defaultSettings)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update local state when userSettings are loaded
  useEffect(() => {
    if (!isLoading && userSettings) {
      setSettings(userSettings)
    }
  }, [isLoading, userSettings])

  const handleToggle = (key: keyof UserSettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleChange = (key: keyof UserSettings, value: string | number) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await updateGeneralSettings(settings)

      toast({
        title: "Settings updated",
        description: "Your settings have been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load user settings. Please refresh the page and try again.</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>Configure application appearance and behavior</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select value={settings.theme} onValueChange={(value) => handleChange("theme", value)}>
                <SelectTrigger id="theme">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-1">Choose your preferred color theme</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto_refresh">Auto Refresh</Label>
                <p className="text-sm text-muted-foreground">Automatically refresh data at regular intervals</p>
              </div>
              <Switch
                id="auto_refresh"
                checked={settings.auto_refresh}
                onCheckedChange={() => handleToggle("auto_refresh")}
              />
            </div>

            {settings.auto_refresh && (
              <div className="space-y-2 ml-6 border-l-2 pl-4 border-muted">
                <Label htmlFor="refresh_interval">Refresh Interval</Label>
                <Select
                  value={settings.refresh_interval.toString()}
                  onValueChange={(value) => handleChange("refresh_interval", Number.parseInt(value))}
                >
                  <SelectTrigger id="refresh_interval">
                    <SelectValue placeholder="Select interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 seconds</SelectItem>
                    <SelectItem value="30">30 seconds</SelectItem>
                    <SelectItem value="60">1 minute</SelectItem>
                    <SelectItem value="300">5 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show_offline_servers">Show Offline Servers</Label>
                <p className="text-sm text-muted-foreground">Display servers that are currently offline</p>
              </div>
              <Switch
                id="show_offline_servers"
                checked={settings.show_offline_servers}
                onCheckedChange={() => handleToggle("show_offline_servers")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enable_notifications">Browser Notifications</Label>
                <p className="text-sm text-muted-foreground">Enable browser notifications for important events</p>
              </div>
              <Switch
                id="enable_notifications"
                checked={settings.enable_notifications}
                onCheckedChange={() => handleToggle("enable_notifications")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="compact_view">Compact View</Label>
                <p className="text-sm text-muted-foreground">Use a more compact layout to show more content</p>
              </div>
              <Switch
                id="compact_view"
                checked={settings.compact_view}
                onCheckedChange={() => handleToggle("compact_view")}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-end space-x-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              setSettings(defaultSettings)
            }}
          >
            Reset to Default
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

