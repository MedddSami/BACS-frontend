"use client"

import { useState } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { useMeetings } from "@/lib/hooks/use-meetings"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Download, FileText } from "lucide-react"

export default function MeetingReportsPage() {
  const { meetings } = useMeetings()
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null)

  const getMeetingStats = (meeting: any) => {
    return {
      totalActions: meeting.actions?.length || 0,
      completedActions: meeting.actions?.filter((a: any) => a.status === "COMPLETED").length || 0,
      totalConcerns: meeting.concerns?.length || 0,
      criticalConcerns: meeting.concerns?.filter((c: any) => c.severityRating === "CRITICAL").length || 0,
      totalGoals: meeting.businessGoals?.length || 0,
      completedGoals: meeting.businessGoals?.filter((g: any) => g.status === "COMPLETED").length || 0,
      suggestions: meeting.suggestions?.length || 0,
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground text-balance">Meeting Reports</h2>
            <p className="text-muted-foreground mt-1">View detailed analytics and reports for your meetings</p>
          </div>
        </div>

        {selectedMeeting ? (
          <div className="space-y-6">
            <Button onClick={() => setSelectedMeeting(null)} variant="outline" className="mb-4">
              ← Back to All Meetings
            </Button>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {selectedMeeting.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Meeting Details</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">Date</p>
                      <p className="text-muted-foreground">
                        {new Date(selectedMeeting.scheduledAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Type</p>
                      <p className="text-muted-foreground">{selectedMeeting.meetingType}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Status</p>
                      <Badge>{selectedMeeting.status}</Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Participants</p>
                      <p className="text-muted-foreground">{selectedMeeting.participants?.length || 0}</p>
                    </div>
                  </div>
                </div>

                {selectedMeeting.description && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Description</p>
                    <p className="text-muted-foreground">{selectedMeeting.description}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-foreground mb-4">BACS+ Summary</p>
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-muted/50">
                      <CardContent className="pt-6">
                        <p className="text-2xl font-bold text-foreground">
                          {getMeetingStats(selectedMeeting).totalActions}
                        </p>
                        <p className="text-xs text-muted-foreground">Total Actions</p>
                        <p className="text-sm text-green-600 mt-2">
                          {getMeetingStats(selectedMeeting).completedActions} Completed
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/50">
                      <CardContent className="pt-6">
                        <p className="text-2xl font-bold text-foreground">
                          {getMeetingStats(selectedMeeting).totalConcerns}
                        </p>
                        <p className="text-xs text-muted-foreground">Total Concerns</p>
                        <p className="text-sm text-red-600 mt-2">
                          {getMeetingStats(selectedMeeting).criticalConcerns} Critical
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/50">
                      <CardContent className="pt-6">
                        <p className="text-2xl font-bold text-foreground">
                          {getMeetingStats(selectedMeeting).totalGoals}
                        </p>
                        <p className="text-xs text-muted-foreground">Business Goals</p>
                        <p className="text-sm text-blue-600 mt-2">
                          {getMeetingStats(selectedMeeting).completedGoals} Completed
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/50">
                      <CardContent className="pt-6">
                        <p className="text-2xl font-bold text-foreground">
                          {getMeetingStats(selectedMeeting).suggestions}
                        </p>
                        <p className="text-xs text-muted-foreground">Suggestions</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="bg-primary hover:bg-primary/90 flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export as PDF
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                    <FileText className="h-4 w-4" />
                    Export as JSON
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                All Meetings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {meetings && meetings.length > 0 ? (
                  meetings.map((meeting) => {
                    const stats = getMeetingStats(meeting)
                    return (
                      <div
                        key={meeting.id}
                        className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => setSelectedMeeting(meeting)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">{meeting.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {new Date(meeting.scheduledAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className="ml-2">{meeting.status}</Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-border">
                          <div>
                            <p className="text-xs text-muted-foreground">Actions</p>
                            <p className="text-lg font-semibold text-foreground">{stats.totalActions}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Concerns</p>
                            <p className="text-lg font-semibold text-foreground">{stats.totalConcerns}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Goals</p>
                            <p className="text-lg font-semibold text-foreground">{stats.totalGoals}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Suggestions</p>
                            <p className="text-lg font-semibold text-foreground">{stats.suggestions}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-muted-foreground text-center py-8">No meetings found</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
