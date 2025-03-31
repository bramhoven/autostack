import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  actionLabel?: string
  actionLink?: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, actionLabel, actionLink, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-muted/30 p-6 rounded-full mb-4">{icon}</div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-muted-foreground mb-4 max-w-md">{description}</p>
      {action ? (
        action
      ) : actionLink && actionLabel ? (
        <Link href={actionLink}>
          <Button className="rounded-full px-8 gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300">
            {actionLabel}
          </Button>
        </Link>
      ) : null}
    </div>
  )
}

