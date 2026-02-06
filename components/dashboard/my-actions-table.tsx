"use client"

import { useActions } from "@/lib/hooks/use-meetings"
import { Badge } from "@/components/ui/badge"

const statusColors: Record<string, string> = {
  NEW: "bg-gray-100 text-gray-800",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-green-100 text-green-800",
  ON_HOLD: "bg-red-100 text-red-800",
}

const priorityColors: Record<string, string> = {
  LOW: "bg-blue-100 text-blue-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HIGH: "bg-orange-100 text-orange-800",
  CRITICAL: "bg-red-100 text-red-800",
}

export default function MyActionsTable() {
  const { actions } = useActions()

  if (actions.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No actions assigned</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="px-4 py-2 text-left font-semibold text-foreground">Action</th>
            <th className="px-4 py-2 text-left font-semibold text-foreground">Status</th>
            <th className="px-4 py-2 text-left font-semibold text-foreground">Priority</th>
            <th className="px-4 py-2 text-left font-semibold text-foreground">Due Date</th>
          </tr>
        </thead>
        <tbody>
          {actions.map((action) => (
            <tr key={action.id} className="border-b border-border hover:bg-muted/50 transition-colors">
              <td className="px-4 py-3 text-foreground font-medium">{action.description}</td>
              <td className="px-4 py-3">
                <Badge className={statusColors[action.status] || "bg-gray-100 text-gray-800"}>
                  {action.status.replace(/_/g, " ")}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <Badge className={priorityColors[action.priority] || "bg-gray-100 text-gray-800"}>
                  {action.priority}
                </Badge>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {new Date(action.deadline).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
