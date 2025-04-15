"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { updateNotificationSettings } from "@/lib/actions/user"
import { useUserSettings } from "@/hooks/use-user-settings"
import { Loader2 } from "lucide-react"

export function NotificationSettings() {
  const { toast } = useToast()
  const { settings: userSettings, isLoading, error, setSettings } = useUserSettings()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [localSettings, setLocalSettings] = useState({
    enable_notifications: true,
    email_notifications: true,
    server_alerts: true,
    installation_updates: true,
    security_alerts: true,
    marketing_emails: false,
  })

  // Update local state when userSettings are loaded
  useEffect(() => {
    if (!isLoading && userSettings) {
      setLocalSettings({
        enable_notifications: userSettings.enable_notifications ?? true,
        email_notifications: userSettings.email_notifications ?? true,
        server_alerts: userSettings.server_alerts ?? true,
        installation_updates: userSettings.installation_updates ?? true,
        security_alerts: userSettings.security_alerts ?? true,
        marketing_emails: userSettings.marketing_emails ?? false,
      })
    }
  }, [isLoading, userSettings])

  const handleToggle = (key: keyof typeof localSettings) => {
    setLocalSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await updateNotificationSettings(localSettings)

      // Update the global settings state
      setSettings((prev) => ({
        ...prev,
        ...localSettings,
      }))

      toast({
        title: "Notification settings updated",
        description: "Your notification preferences have been saved.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notification settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Manage how you receive notifications and updates</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enable_notifications">All Notifications</Label>
                <p className="text-sm text-muted-foreground">Master toggle for all notification types</p>
              </div>
              <Switch
                id="enable_notifications"
                checked={localSettings.enable_notifications}
                onCheckedChange={() => handleToggle("enable_notifications")}
              />
            </div>

            {localSettings.enable_notifications && (
              <>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email_notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive email notifications for important updates</p>
                  </div>
                  <Switch
                    id="email_notifications"
                    checked={localSettings.email_notifications}
                    onCheckedChange={() => handleToggle("email_notifications")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="server_alerts">Server Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified about server status changes and issues</p>
                  </div>
                  <Switch
                    id="server_alerts"
                    checked={localSettings.server_alerts}
                    onCheckedChange={() => handleToggle("server_alerts")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="installation_updates">Installation Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about software installation updates
                    </p>
                  </div>
                  <Switch
                    id="installation_updates"
                    checked={localSettings.installation_updates}
                    onCheckedChange={() => handleToggle("installation_updates")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="security_alerts">Security Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get important security notifications and alerts</p>
                  </div>
                  <Switch
                    id="security_alerts"
                    checked={localSettings.security_alerts}
                    onCheckedChange={() => handleToggle("security_alerts")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing_emails">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Receive promotional emails and special offers</p>
                  </div>
                  <Switch
                    id="marketing_emails"
                    checked={localSettings.marketing_emails}
                    onCheckedChange={() => handleToggle("marketing_emails")}
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-end space-x-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              setLocalSettings({
                enable_notifications: true,
                email_notifications: true,
                server_alerts: true,
                installation_updates: true,
                security_alerts: true,
                marketing_emails: false,
              })
            }}
          >
            Reset to Default
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Preferences"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
