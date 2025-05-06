import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Suspense } from "react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { ServerForm } from "@/components/servers/server-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AddServerPage() {
  return (
    <DashboardLayout>
      <div className="container py-8">
        <div className="mb-8">
          <Link
            href="/servers"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Servers
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Add New Server</h1>
          <p className="text-muted-foreground">Configure your server details to add it to your account</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Suspense fallback={<div className="p-8 text-center">Loading server form...</div>}>
              <ServerForm />
            </Suspense>
          </div>
          <div>
            <Card className="border-primary/10 shadow-lg">
              <CardHeader className="bg-muted/30 border-b border-border/50">
                <CardTitle>Server Requirements</CardTitle>
                <CardDescription>Make sure your server meets these requirements</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Supported Operating Systems</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Ubuntu 20.04 LTS or newer</li>
                    <li>• Debian 11 or newer</li>
                    <li>• CentOS 8 or newer</li>
                    <li>• Rocky Linux 8 or newer</li>
                    <li>• AlmaLinux 8 or newer</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">System Requirements</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Minimum 1 CPU core</li>
                    <li>• Minimum 1GB RAM</li>
                    <li>• Minimum 10GB free disk space</li>
                    <li>• SSH access with sudo privileges</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Network Requirements</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Public IP address or domain name</li>
                    <li>• SSH port open (default: 22)</li>
                    <li>• Outbound internet access</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
