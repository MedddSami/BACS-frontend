"use client"

import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const completionData = [
  { name: "Completed", value: 65 },
  { name: "In Progress", value: 25 },
  { name: "Not Started", value: 10 },
]

const monthlyData = [
  { month: "Aug", meetings: 8 },
  { month: "Sep", meetings: 12 },
  { month: "Oct", meetings: 15 },
  { month: "Nov", meetings: 10 },
]

const topConcerns = [
  { name: "Resource constraints", count: 12 },
  { name: "Timeline feasibility", count: 10 },
  { name: "Cross-team coordination", count: 8 },
  { name: "Budget limitations", count: 6 },
]

const COLORS = ["#22c55e", "#eab308", "#ef4444"]

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground text-balance">Analytics</h2>
          <p className="text-muted-foreground mt-1">Performance metrics and insights</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Meetings", value: "45", trend: "+8%" },
            { label: "Completed Actions", value: "142", trend: "+12%" },
            { label: "In Progress", value: "28", trend: "-3%" },
            { label: "Avg Participants", value: "5.2", trend: "+2%" },
          ].map((stat, idx) => (
            <Card key={idx} className="shadow-sm">
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground">{stat.label}</div>
                <div className="mt-2 flex items-baseline justify-between">
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-green-600 font-medium">{stat.trend}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Donut Chart */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Action Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={completionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {completionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Line Chart */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Meetings Per Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="meetings" stroke="#3b82f6" dot={{ fill: "#3b82f6", r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Concerns */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Top Concerns & Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topConcerns.map((concern, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-lg bg-muted p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-sm font-medium text-primary">
                      {idx + 1}
                    </div>
                    <span className="text-foreground font-medium">{concern.name}</span>
                  </div>
                  <div className="text-sm font-semibold text-accent">{concern.count} mentions</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
