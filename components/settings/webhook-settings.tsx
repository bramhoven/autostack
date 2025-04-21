"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getWebhooks, createWebhook, deleteWebhook } from "@/lib/actions/webhooks"
import { Webhook, Plus, Trash2, Copy } from "lucide-react"
import { formatDate } from "@/lib/utils/format"

export function WebhookSettings() {
  const { toast } = useToast()
  const [webhooks, setWebhooks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    key: "",
    description: "",
  })

  // Available webhook types
  const webhookTypes = [
    { key: "payment_success", name: "Payment Success" },
    { key: "payment_failed", name: "Payment Failed" },
    { key: "subscription_created", name: "Subscription Created" },
    { key: "software_installation", name: "Software Installation" },
    { key: "server_monitoring", name: "Server Monitoring" },
    { key: "custom", name: "Custom Webhook" },
  ]

  // Fetch webhooks on component mount
  useEffect(() => {
    fetchWebhooks()
  }, [])

  const fetchWebhooks = async () => {
    setIsLoading(true)
    try {
      const data = await getWebhooks()
      setWebhooks(data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch webhooks",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateWebhook = async () => {
    setIsCreating(true)
    try {
      // Validate the key format
      if (formData.key === "custom" && !formData.name) {
        throw new Error("Webhook name is required for custom webhooks")
      }

      const key =
        formData.key === "custom" ? `custom_${formData.name.toLowerCase().replace(/\s+/g, "_")}` : formData.key

      await createWebhook({
        key,
        name: formData.key === "custom" ? formData.name : webhookTypes.find((t) => t.key === formData.key)?.name || "",
        description: formData.description,
      })

      await fetchWebhooks()
      setIsDialogOpen(false)
      resetForm()

      toast({
        title: "Webhook Created",
        description: "Your webhook has been created successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create webhook",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteWebhook = async (id: string) => {
    try {
      await deleteWebhook(id)
      await fetchWebhooks()
      toast({
        title: "Webhook Deleted",
        description: "The webhook has been deleted successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete webhook",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      key: "",
      description: "",
    })
  }

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      resetForm()
    }
  }

  const getWebhookUrl = (webhook: any) => {
    return `${window.location.origin}/api/webhooks/callback/${webhook.key}?secret=${webhook.secret}`
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Webhook Settings</CardTitle>
          <CardDescription>Manage webhooks for n8n and other integrations</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Webhook
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Webhook</DialogTitle>
              <DialogDescription>Create a new webhook for integrating with n8n or other services.</DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleCreateWebhook()
              }}
            >
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="webhook-type">Webhook Type</Label>
                  <select
                    id="webhook-type"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.key}
                    onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                    required
                  >
                    <option value="">Select webhook type</option>
                    {webhookTypes.map((type) => (
                      <option key={type.key} value={type.key}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.key === "custom" && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Webhook Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Server Status Update"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    placeholder="e.g., Webhook for n8n integration"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create Webhook"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : webhooks.length === 0 ? (
          <div className="text-center py-8">
            <Webhook className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No webhooks found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create a webhook to integrate with n8n or other services
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Triggered</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {webhooks.map((webhook) => (
                <TableRow key={webhook.id}>
                  <TableCell className="font-medium">{webhook.name}</TableCell>
                  <TableCell>{webhook.key}</TableCell>
                  <TableCell>{formatDate(webhook.created_at)}</TableCell>
                  <TableCell>{webhook.last_triggered_at ? formatDate(webhook.last_triggered_at) : "Never"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(getWebhookUrl(webhook))
                          toast({
                            title: "Webhook URL Copied",
                            description: "The webhook URL has been copied to your clipboard.",
                          })
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteWebhook(webhook.id)}
                        className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Use these webhooks with n8n to automate software installation and server management.
        </p>
      </CardFooter>
    </Card>
  )
}
