"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AddAttendeeModal from "./add-attendee-modal"
import AddActionModal from "./add-action-modal"
import AddConcernModal from "./add-concern-modal"
import AddBusinessGoalModal from "./add-business-goal-modal"
import AddSuggestionModal from "./add-suggestion-modal"
import TranscriptUploadModal from "./transcript-upload-modal"
import { Button } from "@/components/ui/button"
import { Plus, Upload } from "lucide-react"
import { useMeetings } from "@/lib/hooks/use-meetings"
import { useAppSelector } from "@/lib/store/hooks"

interface MeetingDetailsModalProps {
  meeting: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function MeetingDetailsModal({ meeting, open, onOpenChange }: MeetingDetailsModalProps) {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [showAddAttendee, setShowAddAttendee] = useState(false)
  const [showAddAction, setShowAddAction] = useState(false)
  const [showAddConcern, setShowAddConcern] = useState(false)
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [showAddSuggestion, setShowAddSuggestion] = useState(false)
  const [showTranscriptUpload, setShowTranscriptUpload] = useState(false)
  const {
    addAttendeeToMeeting,
    addActionToMeeting,
    addConcernToMeeting,
    addBusinessGoalToMeeting,
    addSuggestionToMeeting,
    addTranscriptToMeeting,
  } = useMeetings()
  const { user, loading } = useAppSelector(s => s.auth)
  const attendees = meeting?.participants || []
  const businessGoals = meeting?.businessGoals || []
  const agreedActions = meeting?.actions || []
  const concerns = meeting?.concerns || []
  const suggestions = meeting?.suggestions || []
  const affectedPlans = meeting?.affectedPlanTypes || []
  const transcript = meeting?.transcript

  const getDateString = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    } catch {
      return dateString
    }
  }

  const getMeetingTitle = () => {
    return meeting?.title || meeting?.name || "Meeting Details"
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{getMeetingTitle()}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Meeting Metadata */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-lg bg-muted p-4">
              {meeting?.departmentOrCentre && (
                <div>
                  <p className="text-xs text-muted-foreground">Department</p>
                  <p className="font-medium text-foreground text-sm">{meeting.departmentOrCentre}</p>
                </div>
              )}
              {meeting?.scheduledAt && (
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="font-medium text-foreground text-sm">{getDateString(meeting.scheduledAt)}</p>
                </div>
              )}
              {meeting?.meetingMode && (
                <div>
                  <p className="text-xs text-muted-foreground">Mode</p>
                  <Badge variant="outline" className="mt-1">
                    {meeting.meetingMode.replace(/_/g, " ")}
                  </Badge>
                </div>
              )}
              {meeting?.meetingClassification && (
                <div>
                  <p className="text-xs text-muted-foreground">Classification</p>
                  <p className="font-medium text-foreground text-sm">{meeting.meetingClassification}</p>
                </div>
              )}
              {meeting?.committee && (
                <div>
                  <p className="text-xs text-muted-foreground">Committee</p>
                  <p className="font-medium text-foreground text-sm">{meeting.committee}</p>
                </div>
              )}
              {meeting?.meetingFrequency && (
                <div>
                  <p className="text-xs text-muted-foreground">Frequency</p>
                  <p className="font-medium text-foreground text-sm">{meeting.meetingFrequency}</p>
                </div>
              )}
              {meeting?.location && (
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-medium text-foreground text-sm">{meeting.location}</p>
                </div>
              )}
            </div>

            {/* Tabs */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="w-full grid grid-cols-3 md:grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="attendees">Attendees</TabsTrigger>
                {/*<TabsTrigger value="goals">Goals</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
                <TabsTrigger value="concerns">Concerns</TabsTrigger>
                <TabsTrigger value="suggestions">Suggestions</TabsTrigger>*/}
                <TabsTrigger value="transcripts">Transcripts</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Affected Plans</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {affectedPlans.length > 0 ? (
                        affectedPlans.map((plan) => (
                          <Badge key={plan} variant="secondary" className="text-xs">
                            {plan.replace(/_/g, " ")}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No plans affected</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {meeting?.description && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-foreground">{meeting.description}</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Attendees Tab */}
              <TabsContent value="attendees">
                <Card>
                  <CardHeader className="flex items-center justify-between">
                    <CardTitle className="text-sm">Meeting Participants</CardTitle>
                    <Button size="sm" onClick={() => setShowAddAttendee(true)} className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Attendee
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {attendees && attendees.length > 0 ? (
                      <div className="space-y-2">
                        {attendees.map((attendee, idx) => {
                          if (!attendee || typeof attendee !== "object") {
                            return null
                          }

                          return (
                            <div
                              key={idx}
                              className="rounded-lg border border-border p-3 flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <Badge variant="outline" className="text-xs">
                                  {attendee.initials || attendee.name || "N/A"}
                                </Badge>
                                <div className="text-sm">
                                  <p className="font-medium text-foreground">{attendee.name || "Unknown"}</p>
                                  <p className="text-xs text-muted-foreground">{attendee.attendanceMode || "N/A"}</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Badge variant={attendee.isChair ? "default" : "secondary"} className="text-xs">
                                  {attendee.isChair ? "Chair" : "Member"}
                                </Badge>
                                <Badge variant={attendee.isRequired ? "default" : "outline"} className="text-xs">
                                  {attendee.isRequired ? "Required" : "Optional"}
                                </Badge>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No participants recorded</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Business Goals Tab */}
              <TabsContent value="goals">
                <Card>
                  <CardHeader className="flex items-center justify-between">
                    <CardTitle className="text-sm">Business Goals</CardTitle>
                    <Button size="sm" onClick={() => setShowAddGoal(true)} className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Goal
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {businessGoals.length > 0 ? (
                        businessGoals.map((goal) => (
                          <div key={goal.id || goal.code} className="rounded-lg border border-border p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className="text-xs">
                                    {goal.code}
                                  </Badge>
                                  <Badge
                                    className={`text-xs ${goal.status === "COMPLETED"
                                      ? "bg-green-100 text-green-800"
                                      : goal.status === "ON_TRACK"
                                        ? "bg-blue-100 text-blue-800"
                                        : goal.status === "ISSUE"
                                          ? "bg-red-100 text-red-800"
                                          : "bg-gray-100 text-gray-800"
                                      }`}
                                  >
                                    {goal.status.replace(/_/g, " ")}
                                  </Badge>
                                </div>
                                <p className="text-sm text-foreground mb-2">{goal.description}</p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  {goal.ownerName && <span>Owner: {goal.ownerName}</span>}
                                  <span>Deadline: {getDateString(goal.deadline)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No business goals defined</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Actions Tab */}
              <TabsContent value="actions">
                <Card>
                  <CardHeader className="flex items-center justify-between">
                    <CardTitle className="text-sm">Agreed Actions</CardTitle>
                    <Button size="sm" onClick={() => setShowAddAction(true)} className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Action
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {agreedActions.length > 0 ? (
                        agreedActions.map((action) => (
                          <div key={action.id || action.code} className="rounded-lg border border-border p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className="text-xs">
                                    {action.code}
                                  </Badge>
                                  <Badge
                                    className={`text-xs ${action.status === "COMPLETED"
                                      ? "bg-green-100 text-green-800"
                                      : action.status === "IN_PROGRESS"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : action.status === "ON_HOLD"
                                          ? "bg-red-100 text-red-800"
                                          : "bg-gray-100 text-gray-800"
                                      }`}
                                  >
                                    {action.status.replace(/_/g, " ")}
                                  </Badge>
                                </div>
                                <p className="text-sm text-foreground mb-2">{action.description}</p>
                                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                  {action.assignedToName && <span>Assigned to: {action.assignedToName}</span>}
                                  {action.priority && <span>Priority: {action.priority}</span>}
                                  <span>Due: {getDateString(action.deadline)}</span>
                                </div>
                              </div>
                              {action.status !== "COMPLETED" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    const proof = prompt("Enter proof of completion:")
                                    if (proof) {
                                      // Call markActionAsComplete with proof
                                    }
                                  }}
                                >
                                  Complete
                                </Button>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No actions defined</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Concerns Tab */}
              <TabsContent value="concerns">
                <Card>
                  <CardHeader className="flex items-center justify-between">
                    <CardTitle className="text-sm">Concerns and Risks</CardTitle>
                    <Button size="sm" onClick={() => setShowAddConcern(true)} className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Concern
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {concerns.length > 0 ? (
                        concerns.map((concern) => (
                          <div key={concern.id || concern.code} className="rounded-lg border border-border p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className="text-xs">
                                    {concern.code}
                                  </Badge>
                                  <Badge
                                    className={`text-xs ${concern.severityRating === "CRITICAL"
                                      ? "bg-red-600 text-white"
                                      : concern.severityRating === "HIGH"
                                        ? "bg-red-100 text-red-800"
                                        : concern.severityRating === "MEDIUM"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-gray-100 text-gray-800"
                                      }`}
                                  >
                                    {concern.severityRating.replace(/_/g, " ")}
                                  </Badge>
                                </div>
                                <p className="text-sm text-foreground mb-2">{concern.description}</p>
                                {concern.impact && (
                                  <p className="text-xs text-muted-foreground mb-2">Impact: {concern.impact}</p>
                                )}
                                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                  {concern.raisedByName && <span>Raised by: {concern.raisedByName}</span>}
                                  {concern.distributionScope && <span>Scope: {concern.distributionScope}</span>}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No concerns identified</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Suggestions Tab */}
              <TabsContent value="suggestions">
                <Card>
                  <CardHeader className="flex items-center justify-between">
                    <CardTitle className="text-sm">Suggestions</CardTitle>
                    <Button size="sm" onClick={() => setShowAddSuggestion(true)} className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Suggestion
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {suggestions.length > 0 ? (
                        suggestions.map((suggestion) => (
                          <div key={suggestion.id || suggestion.code} className="rounded-lg border border-border p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className="text-xs">
                                    {suggestion.code}
                                  </Badge>
                                </div>
                                <p className="text-sm text-foreground mb-2">{suggestion.description}</p>
                                {suggestion.expectedBenefit && (
                                  <p className="text-xs text-muted-foreground mb-2">
                                    Benefit: {suggestion.expectedBenefit}
                                  </p>
                                )}
                                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                  {suggestion.suggestedByName && (
                                    <span>Suggested by: {suggestion.suggestedByName}</span>
                                  )}
                                  {suggestion.distributionScope && <span>Scope: {suggestion.distributionScope}</span>}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No suggestions provided</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Transcripts Tab */}
              <TabsContent value="transcripts" className="space-y-4">
                <Card>
                  <CardHeader className="flex items-center justify-between">
                    <CardTitle className="text-sm">Meeting Transcripts</CardTitle>
                    <Button size="sm" onClick={() => setShowTranscriptUpload(true)} className="gap-2">
                      <Upload className="w-4 h-4" />
                      Upload Transcript
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {transcript ? (
                      <div className="space-y-3">
                        <div className="rounded-lg border border-border p-4">
                          <p className="font-medium text-sm mb-2">{transcript.fileName}</p>
                          <p className="text-xs text-muted-foreground mb-3">
                            Uploaded by {transcript.uploadedByName} on {getDateString(transcript.uploadedAt)}
                          </p>
                          <div className="bg-muted p-3 rounded text-sm max-h-48 overflow-y-auto">
                            {transcript.content}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No transcript uploaded</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modals for adding items */}
      <AddAttendeeModal
        open={showAddAttendee}
        onOpenChange={setShowAddAttendee}
        onSubmit={(participant) => {
          addAttendeeToMeeting(meeting.id, participant)
          setShowAddAttendee(false)
        }}
      />

      <AddActionModal
        open={showAddAction}
        onOpenChange={setShowAddAction}
        onSubmit={(action) => {
          addActionToMeeting(meeting.id, action)
          setShowAddAction(false)
        }}
        currentUserId={user?.id || 1}
      />

      <AddConcernModal
        open={showAddConcern}
        onOpenChange={setShowAddConcern}
        onSubmit={(concern) => {
          addConcernToMeeting(meeting.id, concern)
          setShowAddConcern(false)
        }}
        currentUserId={user?.id || 1}
      />

      <AddBusinessGoalModal
        open={showAddGoal}
        onOpenChange={setShowAddGoal}
        onSubmit={(goal) => {
          addBusinessGoalToMeeting(meeting.id, goal)
          setShowAddGoal(false)
        }}
        currentUserId={user?.id || 1}
      />

      <AddSuggestionModal
        open={showAddSuggestion}
        onOpenChange={setShowAddSuggestion}
        onSubmit={(suggestion) => {
          addSuggestionToMeeting(meeting.id, suggestion)
          setShowAddSuggestion(false)
        }}
        currentUserId={user?.id || 1}
      />

      <TranscriptUploadModal
        open={showTranscriptUpload}
        onOpenChange={setShowTranscriptUpload}
        onSubmit={(transcript) => {
          addTranscriptToMeeting(meeting.id, transcript)
          setShowTranscriptUpload(false)
        }}
        currentUserId={user?.id || 1}
        meetingId={meeting.id}
      />
    </>
  )
}
