"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { useActions } from "@/lib/hooks/use-meetings"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { useEffect } from "react"
import { fetchMyDashboard } from "@/lib/store/dashboard/dashboardSlice"
import { Spinner } from "../ui/spinner"

const COLORS = ["#22c55e", "#eab308", "#ef4444", "#8b5cf6"]

export default function ActionCompletionChart() {
  const { actions } = useActions()

  const dispatch = useAppDispatch()
  const { data, loading } = useAppSelector(state => state.dashboard)

  useEffect(() => {
    dispatch(fetchMyDashboard())
  }, [dispatch])

  //const chartData = [
  //  { name: "Completed", value: actions.filter((a) => a.status === "COMPLETED").length },
  //  { name: "In Progress", value: actions.filter((a) => a.status === "IN_PROGRESS").length },
  //  { name: "Not Started", value: actions.filter((a) => a.status === "NEW").length },
  //  { name: "On Hold", value: actions.filter((a) => a.status === "ON_HOLD").length },
  //]

  const chartData = [
    { name: "Completed", value: data?.stats.completedActions ?? 0 },
    { name: "In Progress", value: data?.stats.inProgressActions ?? 0 },
    { name: "Open", value: data?.stats.openActions ?? 0 },
    { name: "Overdue", value: data?.stats.overdueActions ?? 0 },
  ]

  const hasData = chartData.some((d) => d.value > 0)

  //if (!hasData) {
  //  return (
  //    <div className="h-64 w-full flex items-center justify-center text-muted-foreground">No action data available</div>
  //  )
  //}

  if (loading) return <Spinner />

  return (
    <div className="h-64 w-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
