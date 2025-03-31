import { Progress } from "@/components/ui/progress"
import { Cpu, MemoryStick, HardDrive } from "lucide-react"

interface MonitoringStatsProps {
  cpu?: string
  memory?: string
  disk?: string
}

export function MonitoringStats({ cpu, memory, disk }: MonitoringStatsProps) {
  if (!cpu && !memory && !disk) return null

  return (
    <div className="space-y-3 pt-2">
      {cpu && (
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Cpu className="h-3 w-3" /> CPU Load
            </span>
            <span className="text-xs font-medium">{cpu}</span>
          </div>
          <Progress value={Number.parseInt(cpu) || 0} className="h-1.5" />
        </div>
      )}

      {memory && (
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <MemoryStick className="h-3 w-3" /> Memory Usage
            </span>
            <span className="text-xs font-medium">{memory}</span>
          </div>
          <Progress value={Number.parseInt(memory) || 0} className="h-1.5" />
        </div>
      )}

      {disk && (
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <HardDrive className="h-3 w-3" /> Disk Usage
            </span>
            <span className="text-xs font-medium">{disk}</span>
          </div>
          <Progress value={Number.parseInt(disk) || 0} className="h-1.5" />
        </div>
      )}
    </div>
  )
}

