"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Server } from "@/lib/actions/servers"

interface ServerMonitoringProps {
  server: Server
}

export function ServerMonitoring({ server }: ServerMonitoringProps) {
  const [timeRange, setTimeRange] = useState("24h")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Performance Monitoring</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">Last Hour</SelectItem>
            <SelectItem value="6h">Last 6 Hours</SelectItem>
            <SelectItem value="24h">Last 24 Hours</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="cpu" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="cpu">CPU</TabsTrigger>
          <TabsTrigger value="memory">Memory</TabsTrigger>
          <TabsTrigger value="disk">Disk</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
        </TabsList>

        <TabsContent value="cpu">
          <Card>
            <CardHeader>
              <CardTitle>CPU Usage</CardTitle>
              <CardDescription>CPU utilization over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-muted/20 rounded-md">
                <p className="text-muted-foreground">CPU usage chart will be displayed here</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Average Load</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1.25</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-green-500">↓ 0.3</span> from previous period
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Peak Usage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">78%</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-red-500">↑ 5%</span> from previous period
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="memory">
          <Card>
            <CardHeader>
              <CardTitle>Memory Usage</CardTitle>
              <CardDescription>Memory utilization over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-muted/20 rounded-md">
                <p className="text-muted-foreground">Memory usage chart will be displayed here</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Average Usage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3.2 GB</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-green-500">↓ 0.5 GB</span> from previous period
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Peak Usage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">5.8 GB</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-red-500">↑ 0.2 GB</span> from previous period
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disk">
          <Card>
            <CardHeader>
              <CardTitle>Disk Usage</CardTitle>
              <CardDescription>Disk utilization over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-muted/20 rounded-md">
                <p className="text-muted-foreground">Disk usage chart will be displayed here</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Used Space</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">128 GB</div>
                    <p className="text-xs text-muted-foreground mt-1">25% of total capacity</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">I/O Operations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">245 IOPS</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-red-500">↑ 12%</span> from previous period
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network">
          <Card>
            <CardHeader>
              <CardTitle>Network Traffic</CardTitle>
              <CardDescription>Network traffic over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-muted/20 rounded-md">
                <p className="text-muted-foreground">Network traffic chart will be displayed here</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Inbound Traffic</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1.2 MB/s</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-red-500">↑ 0.3 MB/s</span> from previous period
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Outbound Traffic</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0.8 MB/s</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-green-500">↓ 0.1 MB/s</span> from previous period
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

