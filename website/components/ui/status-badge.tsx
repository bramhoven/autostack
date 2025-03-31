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
        return "text-green-500"
      case "stopped":
      case "offline":
        return "text-red-500"
      default:
        return "text-yellow-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
      case "online":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "stopped":
      case "offline":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  return (
    <Badge variant="outline" className={`flex items-center gap-1 ${getStatusColor(status)}`}>
      {getStatusIcon(status)}
      <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
    </Badge>
  )
}

