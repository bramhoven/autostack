"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      <Link
        href="/dashboard"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary relative group",
          pathname === "/dashboard" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Dashboard
        {pathname === "/dashboard" && <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-primary"></span>}
        <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
      </Link>
      <Link
        href="/servers"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary relative group",
          pathname === "/servers" || pathname.startsWith("/servers/") ? "text-primary" : "text-muted-foreground",
        )}
      >
        Servers
        {(pathname === "/servers" || pathname.startsWith("/servers/")) && (
          <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-primary"></span>
        )}
        <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
      </Link>
      <Link
        href="/cloud-providers"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary relative group",
          pathname === "/cloud-providers" || pathname.startsWith("/cloud-providers/")
            ? "text-primary"
            : "text-muted-foreground",
        )}
      >
        Cloud Providers
        {(pathname === "/cloud-providers" || pathname.startsWith("/cloud-providers/")) && (
          <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-primary"></span>
        )}
        <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
      </Link>
      <Link
        href="/software/install"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary relative group",
          pathname === "/software/install" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Install Software
        {pathname === "/software/install" && (
          <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-primary"></span>
        )}
        <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
      </Link>
      <Link
        href="/settings"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary relative group",
          pathname === "/settings" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Settings
        {pathname === "/settings" && <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-primary"></span>}
        <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
      </Link>
    </nav>
  )
}
