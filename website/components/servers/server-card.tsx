"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
import { MonitoringStats } from "@/components/ui/monitoring-stats"
import { Trash2 } from "lucide-react"
import type { Server } from "@/lib/actions/servers"

interface ServerCardProps {
  server: Server
  softwareCount: number
  onDelete: (id: number) => void
}

export function ServerCard({ server, softwareCount, onDelete }: ServerCardProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-primary/10 hover:border-primary/30">
      <CardHeader className="bg-muted/30">
        <div className="flex justify-between items-center">
          <CardTitle>{server.name}</CardTitle>
          <StatusBadge status={server.status} />
        </div>
        <CardDescription className="font-mono text-xs">{server.ip_address}</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">SSH User:</span>
            <span className="font-medium">{server.username}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">SSH Port:</span>
            <span className="font-medium">{server.ssh_port}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Software Installed:</span>
            <span className="font-medium">{softwareCount}</span>
          </div>

          <MonitoringStats cpu={server.load} memory={server.memory} disk={server.disk} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between bg-muted/30 border-t border-border/50 px-6 py-4">
        <Link href={`/servers/${server.id}`}>
          <Button variant="outline" size="sm" className="rounded-full">
            Details
          </Button>
        </Link>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full text-destructive hover:bg-destructive/10"
          onClick={() => onDelete(server.id)}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Remove
        </Button>
      </CardFooter>
    </Card>
  )
}

