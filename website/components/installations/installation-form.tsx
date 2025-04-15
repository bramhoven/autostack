"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useServers } from "@/hooks/use-servers"
import { useSoftware } from "@/hooks/use-software"
import { useInstallations } from "@/hooks/use-installations"

export function InstallationForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedSoftware, setSelectedSoftware] = useState<string>("")
  const [selectedServer, setSelectedServer] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  const { servers, isLoading: serversLoading } = useServers()
  const { software, isLoading: softwareLoading } = useSoftware()
  const { installations, isLoading: installationsLoading, createInstallation } = useInstallations()

  const isLoading = serversLoading || softwareLoading || installationsLoading

  // Get available servers (those without the selected software)
  const getAvailableServers = () => {
    if (!selectedSoftware) return servers

    // Filter out servers that already have the selected software installed
    const serversWithSelectedSoftware = installations
      .filter((installation) => installation.software_id === Number.parseInt(selectedSoftware))
      .map((installation) => installation.server_id)

    return servers.filter((server) => !serversWithSelectedSoftware.includes(server.id))
  }

  // Get available software (those not installed on the selected server)
  const getAvailableSoftware = () => {
    if (!selectedServer) return software

    // Filter out software that is already installed on the selected server
    const softwareOnSelectedServer = installations
      .filter((installation) => installation.server_id === Number.parseInt(selectedServer))
      .map((installation) => installation.software_id)

    return software.filter((sw) => !softwareOnSelectedServer.includes(sw.id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      if (!selectedSoftware || !selectedServer) {
        throw new Error("Please select both a server and software")
      }

      const softwareItem = software.find((s) => s.id.toString() === selectedSoftware)

      if (!softwareItem) {
        throw new Error("Selected software not found")
      }

      // Create installation
      const success = await createInstallation({
        server_id: Number.parseInt(selectedServer),
        software_id: Number.parseInt(selectedSoftware),
        version: softwareItem.version,
      })

      if (success) {
        // Redirect to dashboard
        router.push("/dashboard")
      }
    } catch (error: any) {
      setError(error.message || "Failed to install software")
    } finally {
      setIsSubmitting(false)
    }
  }

  const availableServers = getAvailableServers()
  const availableSoftware = getAvailableSoftware()

  const selectedSoftwareDetails = selectedSoftware ? software.find((s) => s.id.toString() === selectedSoftware) : null

  return (
    <form onSubmit={handleSubmit}>
      <Card className="border-primary/10 shadow-lg">
        <CardHeader className="bg-muted/30 border-b border-border/50">
          <CardTitle>Installation Details</CardTitle>
          <CardDescription>Select the server and software you want to install</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="server">Select Server</Label>
            <Select value={selectedServer} onValueChange={setSelectedServer}>
              <SelectTrigger id="server" className="w-full">
                <SelectValue placeholder="Select a server" />
              </SelectTrigger>
              <SelectContent>
                {availableServers.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No available servers
                  </SelectItem>
                ) : (
                  availableServers.map((server) => (
                    <SelectItem key={server.id} value={server.id.toString()}>
                      {server.name} ({server.ip_address})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {availableServers.length === 0 && (
              <p className="text-sm text-destructive mt-1">No available servers. Add a new server first.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="software">Select Software</Label>
            <Select value={selectedSoftware} onValueChange={setSelectedSoftware}>
              <SelectTrigger id="software" className="w-full">
                <SelectValue placeholder="Select software" />
              </SelectTrigger>
              <SelectContent>
                {availableSoftware.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No available software
                  </SelectItem>
                ) : (
                  availableSoftware.map((sw) => (
                    <SelectItem key={sw.id} value={sw.id.toString()}>
                      {sw.name} (v{sw.version})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {selectedServer && availableSoftware.length === 0 && (
              <p className="text-sm text-destructive mt-1">
                All available software is already installed on this server.
              </p>
            )}
          </div>

          {selectedSoftwareDetails && (
            <div className="pt-4 border-t border-border/50">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-muted/80 to-muted/30 p-2 rounded-md border border-border/50 shadow-sm">
                  <Image
                    src={selectedSoftwareDetails.image_url || "/placeholder.svg"}
                    alt={selectedSoftwareDetails.name}
                    width={50}
                    height={50}
                    className="rounded-sm"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{selectedSoftwareDetails.name}</h3>
                  <p className="text-sm text-muted-foreground">Version {selectedSoftwareDetails.version}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">{selectedSoftwareDetails.description}</p>
              {selectedSoftwareDetails.requirements && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium">Requirements</h4>
                  <p className="text-sm text-muted-foreground">{selectedSoftwareDetails.requirements}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-muted/30 border-t border-border/50">
          <Button
            type="submit"
            className="w-full gap-2 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-md shadow-primary/20"
            disabled={
              isSubmitting ||
              !selectedSoftware ||
              !selectedServer ||
              availableServers.length === 0 ||
              availableSoftware.length === 0
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Installing...
              </>
            ) : (
              "Install Software"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
