import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Clock } from "lucide-react"

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
      case "online":
        return "text-success"
      case "stopped":
      case "offline":
        return "text-error"
      default:
        return "text-warning"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
      case "online":
        return <CheckCircle2 className="h-4 w-4 text-success" />
      case "stopped":
      case "offline":
        return <XCircle className="h-4 w-4 text-error" />
      default:
        return <Clock className="h-4 w-4 text-warning" />
    }
  }

  return (
    <Badge variant="outline" className={`flex items-center gap-1 ${getStatusColor(status)}`}>
      {getStatusIcon(status)}
      <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
    </Badge>
  )
}
