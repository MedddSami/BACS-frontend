"use client"

import { useState } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import CreateMeetingModal from "@/components/modals/create-meeting-modal"
import MeetingDetailsModal from "@/components/modals/meeting-details-modal"
import { useMeetings } from "@/lib/hooks/use-meetings"

const statusColors: Record<string, string> = {
  SCHEDULED: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
}

export default function MeetingsPage() {
  const { meetings } = useMeetings()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground text-balance">Meetings</h2>
            <p className="text-muted-foreground mt-1">View and manage all your meetings</p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            + New Meeting
          </Button>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>All Meetings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-2 text-left font-semibold text-foreground">Meeting Name</th>
                    <th className="px-4 py-2 text-left font-semibold text-foreground">Date</th>
                    <th className="px-4 py-2 text-left font-semibold text-foreground">Type</th>
                    <th className="px-4 py-2 text-left font-semibold text-foreground">Participants</th>
                    <th className="px-4 py-2 text-left font-semibold text-foreground">Status</th>
                    <th className="px-4 py-2 text-left font-semibold text-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {meetings && meetings.length > 0 ? (
                    meetings.map((meeting) => (
                      <tr key={meeting.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-3 text-foreground font-medium">{meeting.title}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(meeting.scheduledAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="text-xs">
                            {meeting.meetingType}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{meeting.participants?.length || 0}</td>
                        <td className="px-4 py-3">
                          <Badge className={statusColors[meeting.status] || "bg-gray-100 text-gray-800"}>
                            {meeting.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedMeeting(meeting)}
                            className="text-primary hover:bg-primary/10"
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                        No meetings yet. Create one to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <CreateMeetingModal open={showCreateModal} onOpenChange={setShowCreateModal} />

        {selectedMeeting && (
          <MeetingDetailsModal
            meeting={selectedMeeting}
            open={!!selectedMeeting}
            onOpenChange={(open) => !open && setSelectedMeeting(null)}
          />
        )}
      </div>
    </DashboardLayout>
  )
}
