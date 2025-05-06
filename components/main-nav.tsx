"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, Cloud, CreditCard, FileText, Home, Package, Server, Settings } from "lucide-react"

const mainNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Servers",
    href: "/servers",
    icon: Server,
  },
  {
    title: "Cloud Providers",
    href: "/cloud-providers",
    icon: Cloud,
  },
  {
    title: "Software Catalog",
    href: "/catalog",
    icon: Package,
  },
  {
    title: "Monitoring",
    href: "/monitoring",
    icon: BarChart3,
  },
  {
    title: "Billing",
    href: "/billing",
    icon: CreditCard,
  },
  {
    title: "Documentation",
    href: "/docs",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

interface MainNavProps {
  className?: string
}

export function MainNav({ className }: MainNavProps) {
  const pathname = usePathname()

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {mainNavItems.map((item) => {
        const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center text-sm font-medium transition-colors hover:text-primary",
              isActive ? "text-primary" : "text-muted-foreground",
            )}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}
