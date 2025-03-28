import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Server, Book, Code, HelpCircle } from "lucide-react"

export default function DocsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <div className="bg-gradient-to-r from-primary to-primary/70 p-1.5 rounded-md text-primary-foreground">
              <Server className="h-5 w-5" />
            </div>
            <span className="text-xl">ServerSoft</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/catalog" className="text-sm font-medium transition-colors hover:text-primary">
              Software Catalog
            </Link>
            <Link href="/pricing" className="text-sm font-medium transition-colors hover:text-primary">
              Pricing
            </Link>
            <Link href="/docs" className="text-sm font-medium transition-colors hover:text-primary">
              Documentation
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="rounded-full px-4">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                size="sm"
                className="rounded-full px-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300"
              >
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-8 md:py-10">
          <div className="relative mb-10 overflow-hidden rounded-xl border bg-background p-8 shadow-lg">
            <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rotate-12 bg-primary/10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-64 w-64 -rotate-12 bg-primary/10 blur-3xl"></div>
            <div className="relative">
              <h1 className="text-3xl font-bold tracking-tight mb-2">Documentation</h1>
              <p className="text-muted-foreground max-w-2xl">
                Learn how to use ServerSoft to install and manage open source software on your servers.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="sticky top-24 space-y-4">
                <div className="font-medium">Getting Started</div>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="#introduction" className="text-muted-foreground hover:text-primary transition-colors">
                      Introduction
                    </Link>
                  </li>
                  <li>
                    <Link href="#installation" className="text-muted-foreground hover:text-primary transition-colors">
                      Installation
                    </Link>
                  </li>
                  <li>
                    <Link href="#quickstart" className="text-muted-foreground hover:text-primary transition-colors">
                      Quick Start
                    </Link>
                  </li>
                </ul>
                <div className="font-medium pt-4">Guides</div>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="#servers" className="text-muted-foreground hover:text-primary transition-colors">
                      Managing Servers
                    </Link>
                  </li>
                  <li>
                    <Link href="#software" className="text-muted-foreground hover:text-primary transition-colors">
                      Installing Software
                    </Link>
                  </li>
                  <li>
                    <Link href="#monitoring" className="text-muted-foreground hover:text-primary transition-colors">
                      Monitoring
                    </Link>
                  </li>
                </ul>
                <div className="font-medium pt-4">API Reference</div>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="#rest-api" className="text-muted-foreground hover:text-primary transition-colors">
                      REST API
                    </Link>
                  </li>
                  <li>
                    <Link href="#webhooks" className="text-muted-foreground hover:text-primary transition-colors">
                      Webhooks
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:col-span-3 space-y-12">
              <section id="introduction" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4">Introduction</h2>
                <p className="text-muted-foreground mb-4">
                  ServerSoft is a platform for installing and managing open source software on your servers. It provides
                  a simple web interface for deploying software, monitoring server health, and managing your
                  infrastructure.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <Book className="h-5 w-5 text-primary mb-2" />
                      <CardTitle className="text-base">Documentation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Comprehensive guides and tutorials to help you get the most out of ServerSoft.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <Code className="h-5 w-5 text-primary mb-2" />
                      <CardTitle className="text-base">API Reference</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Detailed API documentation for integrating ServerSoft with your existing tools.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <HelpCircle className="h-5 w-5 text-primary mb-2" />
                      <CardTitle className="text-base">Support</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Get help from our team of experts when you need it.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </section>

              <section id="installation" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4">Installation</h2>
                <p className="text-muted-foreground mb-4">
                  ServerSoft is a cloud-based platform, so there's no installation required. Simply sign up for an
                  account and you're ready to go.
                </p>
                <div className="bg-muted/30 p-4 rounded-lg border border-border/50 mt-4">
                  <h3 className="font-medium mb-2">SSH Key Setup</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    To allow ServerSoft to connect to your servers, you'll need to add our SSH public key to your
                    server's authorized_keys file.
                  </p>
                  <div className="bg-muted p-3 rounded-md font-mono text-xs overflow-x-auto">
                    ssh-rsa
                    AAAAB3NzaC1yc2EAAAADAQABAAABAQC0pA4vzGH+PuCj8bRFSS/xZsOyuhs5u0yI9JOiGb7fcYUYOLMWIzn8+9BpXndrIV1KHm5lbLhYmNQZ9Ww9p2zj/ho0r+9cPxYsAUV+5qbhFfN8XdJB6ofYGt1quHUr1UBuL6KxEpWUEpfGRDGEj4jAk7HYOD8Cz4uJqxMbGYF/Tqg+QdaHhtSEYZBYONZBXPDq+dTl0c9QnSPa3X1YQKPwZXo5lBgArYYy2RNlKXwjXQtN4n9uNFQd7Meb5QnOqZXGmgT7/qYNYHFdYRLqTEIQkgH1oZ4fML8JR5PZ67XZG8PnfliKz4YXFqIZ1QQQyQXVJJLdGGNRri8wFKCLwPAB
                    serversoft@example.com
                  </div>
                </div>
              </section>

              <section id="quickstart" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
                <p className="text-muted-foreground mb-4">Get up and running with ServerSoft in just a few minutes.</p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary font-medium rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <h3 className="font-medium">Create an account</h3>
                      <p className="text-sm text-muted-foreground">Sign up for a ServerSoft account to get started.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary font-medium rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <h3 className="font-medium">Add your server</h3>
                      <p className="text-sm text-muted-foreground">
                        Add your server details and SSH key to ServerSoft.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary font-medium rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <h3 className="font-medium">Install software</h3>
                      <p className="text-sm text-muted-foreground">
                        Browse the software catalog and install your first application.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section id="servers" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4">Managing Servers</h2>
                <p className="text-muted-foreground mb-4">
                  Learn how to add, configure, and manage your servers in ServerSoft.
                </p>
                <Tabs defaultValue="adding">
                  <TabsList>
                    <TabsTrigger value="adding">Adding Servers</TabsTrigger>
                    <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
                    <TabsTrigger value="managing">Managing</TabsTrigger>
                  </TabsList>
                  <TabsContent value="adding" className="mt-4 space-y-4">
                    <p className="text-muted-foreground">
                      To add a new server to ServerSoft, you'll need to provide the server's IP address, SSH port, and
                      username. You'll also need to add our SSH public key to your server's authorized_keys file.
                    </p>
                    <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                      <h3 className="font-medium mb-2">Required Information</h3>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        <li>Server name (for identification)</li>
                        <li>IP address</li>
                        <li>SSH port (usually 22)</li>
                        <li>Username (with sudo privileges)</li>
                      </ul>
                    </div>
                  </TabsContent>
                  <TabsContent value="monitoring" className="mt-4 space-y-4">
                    <p className="text-muted-foreground">
                      ServerSoft provides real-time monitoring of your servers, including CPU usage, memory usage, disk
                      space, and more.
                    </p>
                    <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                      <h3 className="font-medium mb-2">Monitoring Features</h3>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        <li>CPU usage</li>
                        <li>Memory usage</li>
                        <li>Disk space</li>
                        <li>Network traffic</li>
                        <li>Process monitoring</li>
                      </ul>
                    </div>
                  </TabsContent>
                  <TabsContent value="managing" className="mt-4 space-y-4">
                    <p className="text-muted-foreground">
                      ServerSoft makes it easy to manage your servers, including updating software, restarting services,
                      and more.
                    </p>
                    <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                      <h3 className="font-medium mb-2">Management Features</h3>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        <li>Software updates</li>
                        <li>Service management</li>
                        <li>Firewall configuration</li>
                        <li>User management</li>
                        <li>Backup and restore</li>
                      </ul>
                    </div>
                  </TabsContent>
                </Tabs>
              </section>

              <section id="software" className="scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4">Installing Software</h2>
                <p className="text-muted-foreground mb-4">
                  Learn how to install and configure software on your servers using ServerSoft.
                </p>
                <div className="bg-muted/30 p-4 rounded-lg border border-border/50 mt-4">
                  <h3 className="font-medium mb-2">Installation Process</h3>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-2">
                    <li>Browse the software catalog and select the software you want to install.</li>
                    <li>Select the server where you want to install the software.</li>
                    <li>Configure any required settings for the software.</li>
                    <li>Click "Install" to begin the installation process.</li>
                    <li>Monitor the installation progress in the dashboard.</li>
                  </ol>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

