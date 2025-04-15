import type { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  description?: string
  children?: ReactNode
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="relative mb-10 overflow-hidden rounded-xl border bg-background p-8 shadow-lg">
      <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rotate-12 bg-primary/10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-64 w-64 -rotate-12 bg-primary/10 blur-3xl"></div>
      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
        {children}
      </div>
    </div>
  )
}
