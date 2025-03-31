import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { InstallationForm } from "@/components/installations/installation-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function InstallSoftwarePage() {
  return (
    <DashboardLayout>
      <div className="container py-8">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Install Software</h1>
          <p className="text-muted-foreground">Select a server and software to install</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <InstallationForm />
          </div>
          <div>
            <Card className="border-primary/10 shadow-lg">
              <CardHeader className="bg-muted/30 border-b border-border/50">
                <CardTitle>Installation Guide</CardTitle>
                <CardDescription>How software installation works</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Installation Process</h3>
                  <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                    <li>Select a server from your registered servers</li>
                    <li>Choose the software you want to install</li>
                    <li>Our system will connect to your server via SSH</li>
                    <li>The software will be installed and configured</li>
                    <li>You can monitor the installation progress in the dashboard</li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Important Notes</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                    <li>You can only install one instance of each software on a server</li>
                    <li>Make sure your server meets the software requirements</li>
                    <li>The installation process may take several minutes</li>
                    <li>You can cancel the installation from the dashboard if needed</li>
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

