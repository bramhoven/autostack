import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Server, Shield, Zap, RefreshCw } from "lucide-react"

export default function Home() {
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
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 z-0"></div>
          <div className="absolute top-0 left-0 right-0 h-[500px] bg-grid-small-black/[0.2] bg-[length:16px_16px] [mask-image:linear-gradient(to_bottom,white,transparent)] dark:bg-grid-small-white/[0.2]"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80 w-fit mb-2">
                  <span className="flex h-2 w-2 rounded-full bg-primary-foreground mr-1"></span>
                  Now in public beta
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                    Deploy Open Source{" "}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                      Software
                    </span>{" "}
                    with Ease
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Install, manage, and update your favorite open source software on your servers with just a few
                    clicks.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/catalog">
                    <Button
                      size="lg"
                      className="gap-1.5 rounded-full px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-lg shadow-primary/20"
                    >
                      Browse Software
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-full px-8 border-2 hover:bg-primary/5 transition-all duration-300"
                    >
                      Create Account
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[450px] w-[450px] rounded-2xl bg-gradient-to-br from-muted/50 to-muted p-4 shadow-2xl rotate-1 transition-all duration-500 hover:rotate-0">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-full h-full rounded-xl overflow-hidden border border-border/40 bg-background/80 backdrop-blur-sm">
                      <div className="absolute top-0 left-0 right-0 h-10 bg-muted/30 flex items-center px-4">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                      </div>
                      <div className="pt-12 px-6 flex flex-col gap-4">
                        <div className="h-8 w-1/2 bg-muted/50 rounded-md"></div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="h-24 bg-muted/30 rounded-md flex items-center justify-center">
                            <Server className="h-8 w-8 text-primary/40" />
                          </div>
                          <div className="h-24 bg-muted/30 rounded-md flex items-center justify-center">
                            <Shield className="h-8 w-8 text-primary/40" />
                          </div>
                          <div className="h-24 bg-muted/30 rounded-md flex items-center justify-center">
                            <Zap className="h-8 w-8 text-primary/40" />
                          </div>
                        </div>
                        <div className="h-6 w-3/4 bg-muted/50 rounded-md"></div>
                        <div className="h-6 w-2/3 bg-muted/50 rounded-md"></div>
                        <div className="h-6 w-5/6 bg-muted/50 rounded-md"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30 relative">
          <div className="absolute inset-0 bg-grid-small-black/[0.1] bg-[length:20px_20px] dark:bg-grid-small-white/[0.1]"></div>
          <div className="container px-4 md:px-6 relative">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2 max-w-[800px]">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Why Choose{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                    ServerSoft
                  </span>
                  ?
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform makes it simple to deploy and manage open source software on your servers.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
              <div className="group flex flex-col items-center space-y-4 rounded-xl border bg-background p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="rounded-full bg-primary/10 p-3 ring-2 ring-primary/20 group-hover:ring-primary/30 transition-all duration-300">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">One-Click Installation</h3>
                <p className="text-center text-muted-foreground">
                  Deploy software to your servers with a single click, no complex configuration required.
                </p>
              </div>
              <div className="group flex flex-col items-center space-y-4 rounded-xl border bg-background p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="rounded-full bg-primary/10 p-3 ring-2 ring-primary/20 group-hover:ring-primary/30 transition-all duration-300">
                  <RefreshCw className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Automatic Updates</h3>
                <p className="text-center text-muted-foreground">
                  Keep your software up to date with automatic security patches and version updates.
                </p>
              </div>
              <div className="group flex flex-col items-center space-y-4 rounded-xl border bg-background p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="rounded-full bg-primary/10 p-3 ring-2 ring-primary/20 group-hover:ring-primary/30 transition-all duration-300">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Centralized Management</h3>
                <p className="text-center text-muted-foreground">
                  Manage all your servers and software installations from a single dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tl from-background via-background to-primary/5 z-0"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                    Trusted by{" "}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                      Developers
                    </span>{" "}
                    Worldwide
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Join thousands of developers who trust ServerSoft to manage their server infrastructure.
                  </p>
                </div>
                <ul className="grid gap-2">
                  {[
                    "Supports all major Linux distributions",
                    "Secure SSH-based deployment",
                    "Detailed logs and monitoring",
                    "Custom configuration options",
                    "API access for automation",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col gap-2 min-[400px]:flex-row pt-4">
                  <Link href="/docs">
                    <Button
                      variant="outline"
                      className="rounded-full px-8 border-2 hover:bg-primary/5 transition-all duration-300"
                    >
                      Read Documentation
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 md:gap-8">
                  <div className="grid gap-4">
                    <div className="rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 p-8 shadow-lg">
                      <div className="text-4xl font-bold">50+</div>
                      <div className="text-sm text-muted-foreground">Software packages</div>
                    </div>
                    <div className="rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 p-8 shadow-lg">
                      <div className="text-4xl font-bold">99.9%</div>
                      <div className="text-sm text-muted-foreground">Uptime guarantee</div>
                    </div>
                  </div>
                  <div className="grid gap-4">
                    <div className="rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 p-8 shadow-lg">
                      <div className="text-4xl font-bold">10k+</div>
                      <div className="text-sm text-muted-foreground">Active users</div>
                    </div>
                    <div className="rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 p-8 shadow-lg">
                      <div className="text-4xl font-bold">24/7</div>
                      <div className="text-sm text-muted-foreground">Support available</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-12 md:py-16 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-semibold">
                <div className="bg-gradient-to-r from-primary to-primary/70 p-1.5 rounded-md text-primary-foreground">
                  <Server className="h-5 w-5" />
                </div>
                <span>ServerSoft</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Making server management simple and efficient for developers worldwide.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Changelog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Cookies
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Licenses
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">© 2025 ServerSoft. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect width="4" height="12" x="2" y="9"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M12 2H2v10h10V2zM22 2h-8v10h8V2zM12 14H2v8h10v-8zM22 14h-8v8h8v-8z"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

