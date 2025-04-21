"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Checkbox } from "@/components/ui/checkbox"
import { createApiKey, getApiKeys, deleteApiKey } from "@/lib/actions/api-keys"
import { CopyButton } from "@/components/copy-button"
import { Key, Plus, Trash2, AlertCircle } from "lucide-react"
import { formatDate } from "@/lib/utils/format"

export function ApiKeys() {
  const { toast } = useToast()
  const [apiKeys, setApiKeys] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newApiKey, setNewApiKey] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    expiresIn: "never",
    permissions: ["servers:read"],
  })

  // Available permissions
  const availablePermissions = [
    { id: "servers:read", label: "Read server information" },
    { id: "servers:write", label: "Modify server information" },
    { id: "software:read", label: "Read software information" },
    { id: "software:install", label: "Install software on servers" },
    { id: "installations:read", label: "Read installation information" },
    { id: "installations:update", label: "Update installation status" },
    { id: "webhooks:manage", label: "Manage workflow webhooks" },
  ]

  // Fetch API keys on component mount
  useEffect(() => {
    fetchApiKeys()
  }, [])

  const fetchApiKeys = async () => {
    setIsLoading(true)
    try {
      const keys = await getApiKeys()
      setApiKeys(keys || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch API keys",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateApiKey = async () => {
    setIsCreating(true)
    try {
      // Calculate expiry date if not "never"
      let expiresAt = null
      if (formData.expiresIn !== "never") {
        const days = Number.parseInt(formData.expiresIn)
        const date = new Date()
        date.setDate(date.getDate() + days)
        expiresAt = date.toISOString()
      }

      const result = await createApiKey({
        name: formData.name,
        permissions: formData.permissions,
        expires_at: expiresAt,
      })

      if (result.key) {
        setNewApiKey(result.key)
        await fetchApiKeys()
        toast({
          title: "API Key Created",
          description: "Your new API key has been created successfully.",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create API key",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteApiKey = async (id: string) => {
    try {
      await deleteApiKey(id)
      await fetchApiKeys()
      toast({
        title: "API Key Deleted",
        description: "The API key has been deleted successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete API key",
        variant: "destructive",
      })
    }
  }

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      permissions: checked ? [...prev.permissions, permission] : prev.permissions.filter((p) => p !== permission),
    }))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      expiresIn: "never",
      permissions: ["servers:read"],
    })
    setNewApiKey(null)
  }

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      resetForm()
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>Manage API keys for external integrations like n8n</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{newApiKey ? "API Key Created" : "Create API Key"}</DialogTitle>
              <DialogDescription>
                {newApiKey
                  ? "Copy your API key now. You won't be able to see it again."
                  : "Create a new API key for external integrations."}
              </DialogDescription>
            </DialogHeader>

            {newApiKey ? (
              <div className="space-y-4">
                <div className="bg-muted p-3 rounded-md font-mono text-xs overflow-x-auto break-all">{newApiKey}</div>
                <div className="flex justify-end">
                  <CopyButton text={newApiKey} label="Copy API Key" />
                </div>
                <div className="flex items-center bg-amber-100 dark:bg-amber-900/30 p-3 rounded-md">
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 mr-2 flex-shrink-0" />
                  <p className="text-sm text-amber-800 dark:text-amber-400">
                    Make sure to copy this key now. You won't be able to see it again.
                  </p>
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleCreateApiKey()
                }}
              >
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">API Key Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., n8n Integration"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expires">Expires In</Label>
                    <select
                      id="expires"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.expiresIn}
                      onChange={(e) => setFormData({ ...formData, expiresIn: e.target.value })}
                    >
                      <option value="never">Never</option>
                      <option value="30">30 days</option>
                      <option value="90">90 days</option>
                      <option value="365">1 year</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Permissions</Label>
                    <div className="space-y-2 border rounded-md p-3">
                      {availablePermissions.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={permission.id}
                            checked={formData.permissions.includes(permission.id)}
                            onCheckedChange={(checked) => handlePermissionChange(permission.id, checked === true)}
                          />
                          <label
                            htmlFor={permission.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {permission.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isCreating}>
                    {isCreating ? "Creating..." : "Create API Key"}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : apiKeys.length === 0 ? (
          <div className="text-center py-8">
            <Key className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No API keys found</p>
            <p className="text-sm text-muted-foreground mt-1">Create an API key to integrate with external services</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((key) => (
                <TableRow key={key.id}>
                  <TableCell className="font-medium">{key.name}</TableCell>
                  <TableCell>{formatDate(key.created_at)}</TableCell>
                  <TableCell>{key.expires_at ? formatDate(key.expires_at) : "Never"}</TableCell>
                  <TableCell>{key.last_used_at ? formatDate(key.last_used_at) : "Never used"}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteApiKey(key.id)}
                      className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
