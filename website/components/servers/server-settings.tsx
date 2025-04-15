"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { type Server, updateServer, deleteServer } from "@/lib/actions/servers"
import { useRouter } from "next/navigation"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

interface ServerSettingsProps {
  server: Server
}

export function ServerSettings({ server }: ServerSettingsProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: server.name,
    hostname: server.hostname,
    ip_address: server.ip_address,
    os: server.os,
    location: server.location || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await updateServer(server.id, formData)

      toast({
        title: "Server updated",
        description: "The server has been updated successfully.",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update server. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)

    try {
      await deleteServer(server.id)

      toast({
        title: "Server deleted",
        description: "The server has been deleted successfully.",
      })

      router.push("/servers")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete server. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Server Settings</CardTitle>
            <CardDescription>Update server information and configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Server Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hostname">Hostname</Label>
                <Input id="hostname" name="hostname" value={formData.hostname} onChange={handleChange} required />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="ip_address">IP Address</Label>
                <Input id="ip_address" name="ip_address" value={formData.ip_address} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="os">Operating System</Label>
                <Input id="os" name="os" value={formData.os} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., US East Data Center"
              />
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <Button type="button" variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
              Delete Server
            </Button>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData({
                    name: server.name,
                    hostname: server.hostname,
                    ip_address: server.ip_address,
                    os: server.os,
                    location: server.location || "",
                  })
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Server"
        description="Are you sure you want to delete this server? This action cannot be undone and will remove all associated data, including installations."
        confirmText="Delete Server"
        cancelText="Cancel"
        onConfirm={handleDelete}
        isLoading={isLoading}
      />
    </div>
  )
}
