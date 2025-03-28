import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Server, Search, ArrowRight, Database, Code, Box, Globe, FileText } from "lucide-react"

// Mock data for software catalog
const softwareList = [
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

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "web-server":
      return <Globe className="h-4 w-4" />
    case "database":
      return <Database className="h-4 w-4" />
    case "runtime":
      return <Code className="h-4 w-4" />
    case "container":
      return <Box className="h-4 w-4" />
    case "cms":
      return <FileText className="h-4 w-4" />
    default:
      return <Server className="h-4 w-4" />
  }
}

export default function CatalogPage() {
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {softwareList.map((software) => (
                  <Card
                    key={software.id}
                    className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/30"
                  >
                    <CardHeader className="flex flex-row items-center gap-4 pb-2 relative">
                      <div className="bg-gradient-to-br from-muted/80 to-muted/30 p-2 rounded-md border border-border/50 shadow-sm">
                        <Image
                          src={software.image || "/placeholder.svg"}
                          alt={software.name}
                          width={50}
                          height={50}
                          className="rounded-sm"
                        />
                      </div>
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {software.name}
                          {software.popular && (
                            <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary hover:bg-primary/20">
                              Popular
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          {getCategoryIcon(software.category)}
                          <span className="capitalize">{software.category.replace("-", " ")}</span>
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{software.description}</p>
                    </CardContent>
                    <CardFooter className="bg-muted/30 border-t border-border/50">
                      <Link href={`/install/${software.id}`} className="w-full">
                        <Button className="w-full gap-1 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                          Install
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="web-server" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {softwareList
                  .filter((software) => software.category === "web-server")
                  .map((software) => (
                    <Card
                      key={software.id}
                      className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/30"
                    >
                      <CardHeader className="flex flex-row items-center gap-4 pb-2">
                        <div className="bg-gradient-to-br from-muted/80 to-muted/30 p-2 rounded-md border border-border/50 shadow-sm">
                          <Image
                            src={software.image || "/placeholder.svg"}
                            alt={software.name}
                            width={50}
                            height={50}
                            className="rounded-sm"
                          />
                        </div>
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {software.name}
                            {software.popular && (
                              <Badge
                                variant="secondary"
                                className="ml-2 bg-primary/10 text-primary hover:bg-primary/20"
                              >
                                Popular
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            {getCategoryIcon(software.category)}
                            <span className="capitalize">{software.category.replace("-", " ")}</span>
                          </CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{software.description}</p>
                      </CardContent>
                      <CardFooter className="bg-muted/30 border-t border-border/50">
                        <Link href={`/install/${software.id}`} className="w-full">
                          <Button className="w-full gap-1 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                            Install
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="database" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {softwareList
                  .filter((software) => software.category === "database")
                  .map((software) => (
                    <Card
                      key={software.id}
                      className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/30"
                    >
                      <CardHeader className="flex flex-row items-center gap-4 pb-2">
                        <div className="bg-gradient-to-br from-muted/80 to-muted/30 p-2 rounded-md border border-border/50 shadow-sm">
                          <Image
                            src={software.image || "/placeholder.svg"}
                            alt={software.name}
                            width={50}
                            height={50}
                            className="rounded-sm"
                          />
                        </div>
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {software.name}
                            {software.popular && (
                              <Badge
                                variant="secondary"
                                className="ml-2 bg-primary/10 text-primary hover:bg-primary/20"
                              >
                                Popular
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            {getCategoryIcon(software.category)}
                            <span className="capitalize">{software.category.replace("-", " ")}</span>
                          </CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{software.description}</p>
                      </CardContent>
                      <CardFooter className="bg-muted/30 border-t border-border/50">
                        <Link href={`/install/${software.id}`} className="w-full">
                          <Button className="w-full gap-1 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                            Install
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
            {/* Other tabs would follow the same pattern */}
          </Tabs>
        </div>
      </main>
    </div>
  )
}

