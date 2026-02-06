"use client"

import { useState } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { useMeetings } from "@/lib/hooks/use-meetings"
import { useToast } from "@/hooks/use-toast"
import { Plus, Trash2, CheckCircle, Eye, Upload } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

const statusColors: Record<string, string> = {
  NEW: "bg-gray-100 text-gray-800",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-green-100 text-green-800",
  ON_HOLD: "bg-orange-100 text-orange-800",
}

const priorityColors: Record<string, string> = {
  LOW: "text-blue-600",
  MEDIUM: "text-yellow-600",
  HIGH: "text-orange-600",
  CRITICAL: "text-red-600",
}

export default function ActionsPage() {
  const {
    meetings,
    addActionToMeeting,
    updateActionInMeeting,
    deleteActionInMeeting,
    updateActionStatus,
    markActionAsComplete,
  } = useMeetings()
  const { toast } = useToast()
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [isViewingDetails, setIsViewingDetails] = useState(false)
  const [isUploadingProof, setIsUploadingProof] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState<number | null>(null)
  const [selectedAction, setSelectedAction] = useState<any>(null)
  const [proofText, setProofText] = useState("")
  const [formData, setFormData] = useState({
    description: "",
    deadline: "",
    priority: "MEDIUM" as const,
    assignedToId: 1,
    assignedToName: "Current User",
  })

  const allActions = meetings.flatMap((meeting) =>
    (meeting.actions || []).map((action) => ({
      ...action,
      meetingId: meeting.id,
      meetingTitle: meeting.title,
    })),
  )

  const filteredActions = allActions.filter((action) => {
    const matchesStatus = statusFilter === "all" || action.status === statusFilter
    const matchesPriority = priorityFilter === "all" || action.priority === priorityFilter
    const matchesSearch = action.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesPriority && matchesSearch
  })

  const handleAddAction = () => {
    if (!selectedMeeting || !formData.description || !formData.deadline) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const newAction = {
      code: `ACT-${String(allActions.length + 1).padStart(3, "0")}`,
      description: formData.description,
      deadline: formData.deadline,
      priority: formData.priority,
      distributionScope: "INTERNAL" as const,
      scope: "Team",
      status: "NEW" as const,
      assignedToId: formData.assignedToId,
      assignedToName: formData.assignedToName,
      id: Math.max(...allActions.map((a) => a.id || 0), 0) + 1,
    }

    addActionToMeeting(selectedMeeting, newAction)
    setFormData({
      description: "",
      deadline: "",
      priority: "MEDIUM",
      assignedToId: 1,
      assignedToName: "Current User",
    })
    setSelectedMeeting(null)
    setIsAdding(false)
    toast({
      title: "Success",
      description: "Action added successfully",
    })
  }

  const handleViewDetails = (action: any) => {
    setSelectedAction(action)
    setIsViewingDetails(true)
  }

  const handleUploadProof = () => {
    if (!proofText.trim() || !selectedAction) {
      toast({
        title: "Error",
        description: "Please enter completion proof details",
        variant: "destructive",
      })
      return
    }

    markActionAsComplete(selectedAction.meetingId, selectedAction.id, proofText)
    setIsUploadingProof(false)
    setProofText("")
    setIsViewingDetails(false)
    toast({
      title: "Success",
      description: "Action marked as complete with proof",
    })
  }

  const handleStatusChange = (meetingId: number, actionId: number, newStatus: string) => {
    updateActionStatus(meetingId, actionId, newStatus as any)
    toast({
      title: "Success",
      description: `Action status updated to ${newStatus}`,
    })
  }

  const handleDelete = (meetingId: number, actionId: number) => {
    deleteActionInMeeting(meetingId, actionId)
    toast({
      title: "Success",
      description: "Action deleted successfully",
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground text-balance">Action Items</h2>
            <p className="text-muted-foreground mt-1">Track and manage all action items from meetings</p>
          </div>
          <Dialog open={isAdding} onOpenChange={setIsAdding}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Action
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Action Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Meeting</label>
                  <Select
                    value={selectedMeeting?.toString() || ""}
                    onValueChange={(v) => setSelectedMeeting(Number(v))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select meeting" />
                    </SelectTrigger>
                    <SelectContent>
                      {meetings.map((m) => (
                        <SelectItem key={m.id} value={m.id.toString()}>
                          {m.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Action Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the action..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Deadline</label>
                  <Input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <Select
                    value={formData.priority}
                    onValueChange={(v) => setFormData({ ...formData, priority: v as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="CRITICAL">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddAction}>Create Action</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <Input
            placeholder="Search actions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="NEW">New</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="ON_HOLD">On Hold</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="CRITICAL">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Actions Grid */}
        <div className="grid gap-4">
          {filteredActions.map((action) => (
            <Card key={`${action.meetingId}-${action.id}`}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className={`h-5 w-5 ${priorityColors[action.priority]}`} />
                      <Badge className={statusColors[action.status]}>{action.status}</Badge>
                      <span className="text-xs text-muted-foreground">{action.code}</span>
                    </div>
                    <h3 className="font-semibold text-foreground">{action.description}</h3>
                    <p className="text-xs text-muted-foreground mt-2">
                      Assigned to: <span className="font-medium">{action.assignedToName}</span> • Deadline:{" "}
                      <span className="font-medium">{new Date(action.deadline).toLocaleDateString()}</span>
                    </p>
                    {action.notes && (
                      <div className="mt-2 p-2 bg-green-50 rounded text-sm text-green-800">{action.notes}</div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(action)} title="View details">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {action.status !== "COMPLETED" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedAction(action)
                          setIsUploadingProof(true)
                        }}
                        title="Upload proof"
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    )}
                    <Select
                      value={action.status}
                      onValueChange={(v) => handleStatusChange(action.meetingId, action.id!, v)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NEW">New</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="ON_HOLD">On Hold</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(action.meetingId, action.id!)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View Details Modal */}
        <Dialog open={isViewingDetails} onOpenChange={setIsViewingDetails}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Action Item Details</DialogTitle>
            </DialogHeader>
            {selectedAction && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Code</label>
                    <p className="text-foreground">{selectedAction.code}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <Badge className={statusColors[selectedAction.status]}>{selectedAction.status}</Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="text-foreground">{selectedAction.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Assigned To</label>
                    <p className="text-foreground">{selectedAction.assignedToName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Deadline</label>
                    <p className="text-foreground">{new Date(selectedAction.deadline).toLocaleDateString()}</p>
                  </div>
                </div>
                {selectedAction.notes && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Completion Proof</label>
                    <p className="text-foreground">{selectedAction.notes}</p>
                  </div>
                )}
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsViewingDetails(false)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Upload Proof Modal */}
        <Dialog open={isUploadingProof} onOpenChange={setIsUploadingProof}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Proof of Completion</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Completion Details</label>
                <Textarea
                  value={proofText}
                  onChange={(e) => setProofText(e.target.value)}
                  placeholder="Describe how the action was completed..."
                  className="h-32"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUploadProof}>Submit Proof</Button>
                <Button variant="outline" onClick={() => setIsUploadingProof(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
