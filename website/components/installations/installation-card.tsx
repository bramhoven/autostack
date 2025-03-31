"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
import { MonitoringStats } from "@/components/ui/monitoring-stats"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, RefreshCw, Trash2 } from "lucide-react"
import type { Installation } from "@/lib/actions/installations"
import type { Software } from "@/lib/actions/software"
import type { Server } from "@/lib/actions/servers"

interface InstallationCardProps {
  installation: Installation
  software: Software
  server: Server
  onUpdate: (id: number) => void
  onDelete: (id: number) => void
  onToggleStatus: (id: number, status: string) => void
  formatDate: (date: string) => string
}

export function InstallationCard({
  installation,
  software,
  server,
  onUpdate,
  onDelete,
  onToggleStatus,
  formatDate,
}: InstallationCardProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-primary/10 hover:border-primary/30">
      <CardHeader className="flex flex-row items-center gap-4 pb-2 bg-muted/30">
        <div className="bg-gradient-to-br from-muted/80 to-muted/30 p-2 rounded-md border border-border/50 shadow-sm">
          <Image
            src={software.image_url || "/placeholder.svg?height=50&width=50"}
            alt={software.name || "Software"}
            width={50}
            height={50}
            className="rounded-sm"
          />
        </div>
        <div className="flex-1">
          <CardTitle className="flex items-center justify-between">
            {software.name}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => onUpdate(installation.id)} className="cursor-pointer">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Update
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={() => onDelete(installation.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Uninstall
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardTitle>
          <CardDescription>Version {installation.version}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Status:</span>
            <StatusBadge status={installation.status} />
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Server:</span>
            <span className="font-medium">{server.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">IP Address:</span>
            <span className="font-mono text-xs bg-muted/50 px-2 py-0.5 rounded">{server.ip_address}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Installed:</span>
            <span>{formatDate(installation.installed_at)}</span>
          </div>

          {installation.status === "running" && <MonitoringStats cpu={installation.cpu} memory={installation.memory} />}
        </div>
      </CardContent>
      <CardFooter className="grid content-center bg-muted/30 border-t border-border/50 px-6 py-4">
        <Button
          variant={installation.status === "running" ? "outline" : "default"}
          className="w-full rounded-full"
          onClick={() => onToggleStatus(installation.id, installation.status)}
        >
          {installation.status === "running" ? "Stop" : "Start"}
        </Button>
      </CardFooter>
    </Card>
  )
}

