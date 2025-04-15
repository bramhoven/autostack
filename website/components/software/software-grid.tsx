import { SoftwareCard, type SoftwareItem } from "./software-card"

interface SoftwareGridProps {
  items: SoftwareItem[]
}

export function SoftwareGrid({ items }: SoftwareGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((software) => (
        <SoftwareCard key={software.id} software={software} />
      ))}
    </div>
  )
}
