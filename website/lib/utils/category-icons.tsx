import { Server, Globe, Database, Code, Box, FileText } from "lucide-react"

export function getCategoryIcon(category: string) {
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
