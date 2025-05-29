import { Badge } from "@/components/ui/badge"
import { AlertCircle, Circle, Minus, ArrowDown } from "lucide-react"

interface PriorityBadgeProps {
  priority: "P1" | "P2" | "P3" | "P4"
  size?: "sm" | "md"
}

const priorityConfig = {
  P1: {
    label: "P1",
    className: "bg-red-500 hover:bg-red-600 text-white border-red-500 shadow-red-200 dark:shadow-red-900/20",
    icon: AlertCircle,
    description: "Critical",
  },
  P2: {
    label: "P2",
    className:
      "bg-orange-500 hover:bg-orange-600 text-white border-orange-500 shadow-orange-200 dark:shadow-orange-900/20",
    icon: Circle,
    description: "High",
  },
  P3: {
    label: "P3",
    className: "bg-blue-500 hover:bg-blue-600 text-white border-blue-500 shadow-blue-200 dark:shadow-blue-900/20",
    icon: Minus,
    description: "Medium",
  },
  P4: {
    label: "P4",
    className: "bg-gray-500 hover:bg-gray-600 text-white border-gray-500 shadow-gray-200 dark:shadow-gray-900/20",
    icon: ArrowDown,
    description: "Low",
  },
}

export function PriorityBadge({ priority, size = "md" }: PriorityBadgeProps) {
  const config = priorityConfig[priority]
  const Icon = config.icon
  const isSmall = size === "sm"

  return (
    <Badge
      className={`${config.className} shadow-sm transition-all duration-200 hover:scale-105 ${
        isSmall ? "text-xs px-2 py-0.5" : "px-3 py-1"
      }`}
      title={`${config.label} - ${config.description}`}
    >
      <Icon className={`${isSmall ? "h-3 w-3" : "h-4 w-4"} mr-1`} />
      {config.label}
    </Badge>
  )
}
