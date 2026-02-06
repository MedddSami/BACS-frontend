"use client"

import { useState } from "react"
import { useMeetings, useActions } from "@/lib/hooks/use-meetings"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import UpcomingMeetingsTable from "@/components/dashboard/upcoming-meetings-table"
import MyActionsTable from "@/components/dashboard/my-actions-table"
import ActionCompletionChart from "@/components/dashboard/action-completion-chart"
import CreateMeetingModal from "@/components/modals/create-meeting-modal"
import { useAppSelector } from "@/lib/store/hooks"
import { selectAuthUser } from "@/lib/store/auth/authSelectors"

export default function DashboardPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const user = useAppSelector(selectAuthUser)
  const { meetings } = useMeetings()
  const { actions } = useActions()

  const stats = {
    totalActions: actions.length,
    openActions: actions.filter((a) => a.status === "NEW").length,
    inProgressActions: actions.filter((a) => a.status === "IN_PROGRESS").length,
    completedActions: actions.filter((a) => a.status === "COMPLETED").length,
    overdueActions: actions.filter((a) => new Date(a.deadline) < new Date() && a.status !== "COMPLETED").length,
    upcomingMeetingsCount: meetings.filter((m) => new Date(m.scheduledAt) > new Date()).length,
    unresolvedConcernsCount: meetings.reduce((count, m) => count + (m.concerns?.length || 0), 0),
  }

  return (
    <div className="space-y-6">
      {/* Header with action button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground text-balance">Welcome back, {user?.firstName || "User"}</h2>
          <p className="text-muted-foreground mt-1">Here's what's happening with your meetings today</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          + New Meeting
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalActions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgressActions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completedActions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdueActions}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Meetings */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Upcoming Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              <UpcomingMeetingsTable />
            </CardContent>
          </Card>

          {/* My Actions */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">My Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <MyActionsTable />
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div>
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Actions Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <ActionCompletionChart />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Meeting Modal */}
      <CreateMeetingModal open={showCreateModal} onOpenChange={setShowCreateModal} />
    </div>
  )
}
