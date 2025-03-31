import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
import { MonitoringStats } from "@/components/ui/monitoring-stats"
import type { Server } from "@/lib/actions/servers"
import { formatDate } from "@/lib/utils/format"
import { Cpu, HardDrive, MemoryStickIcon as Memory, Wifi } from "lucide-react"

interface ServerOverviewProps {
  server: Server
}

export function ServerOverview({ server }: ServerOverviewProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MonitoringStats
          title="CPU Usage"
          value="24%"
          icon={<Cpu className="h-4 w-4" />}
          description="4 cores @ 2.8GHz"
          trend="up"
          trendValue="2%"
        />
        <MonitoringStats
          title="Memory Usage"
          value="3.2 GB"
          icon={<Memory className="h-4 w-4" />}
          description="8 GB Total"
          trend="down"
          trendValue="0.5 GB"
        />
        <MonitoringStats
          title="Disk Usage"
          value="128 GB"
          icon={<HardDrive className="h-4 w-4" />}
          description="512 GB Total"
          trend="up"
          trendValue="2.3 GB"
        />
        <MonitoringStats
          title="Network"
          value="1.2 MB/s"
          icon={<Wifi className="h-4 w-4" />}
          description="10 Mbps Connection"
          trend="up"
          trendValue="0.3 MB/s"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Server Information</CardTitle>
            <CardDescription>Detailed information about this server</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">Status</dt>
                <dd>
                  <StatusBadge status={server.status} />
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">Hostname</dt>
                <dd>{server.hostname}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">IP Address</dt>
                <dd>{server.ip_address}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">Operating System</dt>
                <dd>{server.os}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">Location</dt>
                <dd>{server.location || "Not specified"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">Added On</dt>
                <dd>{formatDate(new Date(server.created_at))}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest events and activities on this server</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  event: "Software Installation",
                  description: "Installed MySQL 8.0.28",
                  time: "2 hours ago",
                },
                {
                  event: "System Update",
                  description: "Applied security patches",
                  time: "Yesterday",
                },
                {
                  event: "Restart",
                  description: "Server restarted after updates",
                  time: "Yesterday",
                },
                {
                  event: "Monitoring Alert",
                  description: "High CPU usage detected",
                  time: "3 days ago",
                },
              ].map((activity, index) => (
                <div key={index} className="flex items-start">
                  <div className="mr-4 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">{activity.event}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

