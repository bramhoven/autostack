"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Loader2 } from "lucide-react"
import { SoftwareGrid } from "@/components/software/software-grid"
import type { SoftwareItem } from "@/components/software/software-card"
import { useAuth } from "@/components/auth/auth-provider"
import { PublicHeader } from "@/components/public-header"

// Mock data for software catalog
const softwareList: SoftwareItem[] = [
  {
    id: 1,
    name: "Nginx",
    category: "web-server",
    description: "High-performance HTTP server and reverse proxy",
    image: "/placeholder.svg?height=80&width=80",
    popular: true,
  },
  {
    id: 2,
    name: "PostgreSQL",
    category: "database",
    description: "Advanced open source relational database",
    image: "/placeholder.svg?height=80&width=80",
    popular: true,
  },
  {
    id: 3,
    name: "Redis",
    category: "database",
    description: "In-memory data structure store",
    image: "/placeholder.svg?height=80&width=80",
    popular: false,
  },
  {
    id: 4,
    name: "Node.js",
    category: "runtime",
    description: "JavaScript runtime built on Chrome's V8 engine",
    image: "/placeholder.svg?height=80&width=80",
    popular: true,
  },
  {
    id: 5,
    name: "Docker",
    category: "container",
    description: "Platform for developing, shipping, and running applications",
    image: "/placeholder.svg?height=80&width=80",
    popular: true,
  },
  {
    id: 6,
    name: "MongoDB",
    category: "database",
    description: "Document-oriented NoSQL database",
    image: "/placeholder.svg?height=80&width=80",
    popular: false,
  },
  {
    id: 7,
    name: "Apache",
    category: "web-server",
    description: "Cross-platform web server software",
    image: "/placeholder.svg?height=80&width=80",
    popular: false,
  },
  {
    id: 8,
    name: "MySQL",
    category: "database",
    description: "Open-source relational database management system",
    image: "/placeholder.svg?height=80&width=80",
    popular: false,
  },
  {
    id: 9,
    name: "WordPress",
    category: "cms",
    description: "Content management system for websites and blogs",
    image: "/placeholder.svg?height=80&width=80",
    popular: true,
  },
]

export default function CatalogPage() {
  const { user, isLoading } = useAuth()

  const renderNavigation = () => {
    if (user) {
      return (
        <>
          <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
            Dashboard
          </Link>
          <Link href="/servers" className="text-sm font-medium transition-colors hover:text-primary">
            Servers
          </Link>
          <Link href="/catalog" className="text-sm font-medium transition-colors hover:text-primary">
            Software Catalog
          </Link>
        </>
      )
    }

    return (
      <>
        <Link href="/catalog" className="text-sm font-medium transition-colors hover:text-primary">
          Software Catalog
        </Link>
        <Link href="/pricing" className="text-sm font-medium transition-colors hover:text-primary">
          Pricing
        </Link>
        <Link href="/docs" className="text-sm font-medium transition-colors hover:text-primary">
          Documentation
        </Link>
      </>
    )
  }

  const renderAuthButtons = () => {
    if (isLoading) {
      return (
        <Button variant="ghost" size="sm" className="rounded-full px-4" disabled>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Loading...
        </Button>
      )
    }

    if (user) {
      return (
        <Link href="/dashboard">
          <Button
            size="sm"
            className="rounded-full px-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300"
          >
            Dashboard
          </Button>
        </Link>
      )
    }

    return (
      <>
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
      </>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">
        <div className="container py-8 md:py-10">
          <div className="relative mb-10 overflow-hidden rounded-xl border bg-background p-8 shadow-lg">
            <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rotate-12 bg-primary/10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-64 w-64 -rotate-12 bg-primary/10 blur-3xl"></div>
            <div className="relative">
              <h1 className="text-3xl font-bold tracking-tight mb-2">Software Catalog</h1>
              <p className="text-muted-foreground max-w-2xl">
                Browse and install open source software on your servers. We offer a wide range of applications to meet
                your needs.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex w-full md:w-auto items-center gap-2">
              <div className="relative w-full md:w-[300px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search software..."
                  className="w-full pl-8 rounded-full border-primary/20 focus-visible:ring-primary/30"
                />
              </div>
            </div>
          </div>

          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="bg-muted/50 p-1 rounded-full">
              <TabsTrigger value="all" className="rounded-full">
                All
              </TabsTrigger>
              <TabsTrigger value="web-server" className="rounded-full">
                Web Servers
              </TabsTrigger>
              <TabsTrigger value="database" className="rounded-full">
                Databases
              </TabsTrigger>
              <TabsTrigger value="runtime" className="rounded-full">
                Runtimes
              </TabsTrigger>
              <TabsTrigger value="container" className="rounded-full">
                Containers
              </TabsTrigger>
              <TabsTrigger value="cms" className="rounded-full">
                CMS
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6">
              <SoftwareGrid items={softwareList} />
            </TabsContent>
            <TabsContent value="web-server" className="mt-6">
              <SoftwareGrid items={softwareList.filter((software) => software.category === "web-server")} />
            </TabsContent>
            <TabsContent value="database" className="mt-6">
              <SoftwareGrid items={softwareList.filter((software) => software.category === "database")} />
            </TabsContent>
            <TabsContent value="runtime" className="mt-6">
              <SoftwareGrid items={softwareList.filter((software) => software.category === "runtime")} />
            </TabsContent>
            <TabsContent value="container" className="mt-6">
              <SoftwareGrid items={softwareList.filter((software) => software.category === "container")} />
            </TabsContent>
            <TabsContent value="cms" className="mt-6">
              <SoftwareGrid items={softwareList.filter((software) => software.category === "cms")} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

