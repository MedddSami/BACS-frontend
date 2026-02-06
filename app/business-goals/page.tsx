"use client"

import { useState } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { useMeetings } from "@/lib/hooks/use-meetings"
import { useToast } from "@/hooks/use-toast"

const statusColors: Record<string, string> = {
  NEW: "bg-gray-100 text-gray-800",
  ON_TRACK: "bg-green-100 text-green-800",
  ISSUE: "bg-red-100 text-red-800",
  COMPLETED: "bg-blue-100 text-blue-800",
}

export default function BusinessGoalsPage() {
  const {
    meetings,
    addBusinessGoalToMeeting,
    updateBusinessGoal,
    deleteBusinessGoal,
    assignBusinessGoal,
    addActionToMeeting,
  } = useMeetings()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAdding, setIsAdding] = useState(false)
  const [isViewingDetails, setIsViewingDetails] = useState(false)
  const [isAssigningAction, setIsAssigningAction] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState<number | null>(null)
  const [selectedGoal, setSelectedGoal] = useState<any>(null)
  const [newActionDescription, setNewActionDescription] = useState("")
  const [newActionDeadline, setNewActionDeadline] = useState("")
  const [formData, setFormData] = useState({
    description: "",
    deadline: "",
    status: "NEW" as const,
    ownerId: 1,
    ownerName: "Current User",
  })

  const allGoals = meetings.flatMap((meeting) =>
    (meeting.businessGoals || []).map((goal) => ({
      ...goal,
      meetingId: meeting.id,
      meetingTitle: meeting.title,
    })),
  )

  const filteredGoals = allGoals.filter((goal) => {
    const matchesSearch = goal.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || goal.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAddGoal = () => {
    if (!selectedMeeting || !formData.description || !formData.deadline) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const newGoal = {
      code: `BG-${String(allGoals.length + 1).padStart(3, "0")}`,
      description: formData.description,
      deadline: formData.deadline,
      status: formData.status,
      ownerId: formData.ownerId,
      ownerName: formData.ownerName,
      id: Math.max(...allGoals.map((g) => g.id || 0), 0) + 1,
    }

    addBusinessGoalToMeeting(selectedMeeting, newGoal)
    setFormData({
      description: "",
      deadline: "",
      status: "NEW",
      ownerId: 1,
      ownerName: "Current User",
    })
    setSelectedMeeting(null)
    setIsAdding(false)
    toast({
      title: "Success",
      description: "Business goal added successfully",
    })
  }

  const handleViewDetails = (goal: any) => {
    setSelectedGoal(goal)
    setIsViewingDetails(true)
  }

  const handleAddActionToGoal = () => {
    if (!newActionDescription.trim() || !newActionDeadline || !selectedGoal) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const newAction = {
      code: `ACT-${String(Date.now()).slice(-3)}`,
      description: newActionDescription,
      priority: "HIGH" as const,
      distributionScope: "INTERNAL" as const,
      scope: "Team",
      deadline: newActionDeadline,
      assignedToId: selectedGoal.ownerId,
      assignedToName: selectedGoal.ownerName,
      status: "NEW" as const,
      id:
        Math.max(...(meetings.find((m) => m.id === selectedGoal.meetingId)?.actions || []).map((a) => a.id || 0), 0) +
        1,
    }

    addActionToMeeting(selectedGoal.meetingId, newAction)
    setNewActionDescription("")
    setNewActionDeadline("")
    setIsAssigningAction(false)
    toast({
      title: "Success",
      description: "Action assigned to goal successfully",
    })
  }

  const handleStatusChange = (meetingId: number, goalId: number, newStatus: string) => {
    updateBusinessGoal(meetingId, goalId, { status: newStatus as any })
    toast({
      title: "Success",
      description: `Goal status updated to ${newStatus}`,
    })
  }

  const handleDelete = (meetingId: number, goalId: number) => {
    deleteBusinessGoal(meetingId, goalId)
    toast({
      title: "Success",
      description: "Business goal deleted successfully",
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground text-balance">Business Goals</h2>
            <p className="text-muted-foreground mt-1">Track and manage strategic business goals</p>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <span>+</span> Add Goal
          </button>
        </div>

        {isAdding && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Business Goal</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Meeting</label>
                  <select
                    value={selectedMeeting || ""}
                    onChange={(e) => setSelectedMeeting(e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Choose a meeting...</option>
                    {meetings.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Goal Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the business goal..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Initial Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="NEW">New</option>
                    <option value="ON_TRACK">On Track</option>
                    <option value="ISSUE">Issue</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleAddGoal}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Add Goal
                  </button>
                  <button
                    onClick={() => setIsAdding(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <input
            placeholder="Search goals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option className="w-full md:w-40" value="all">
              All Status
            </option>
            <option value="NEW">New</option>
            <option value="ON_TRACK">On Track</option>
            <option value="ISSUE">Issue</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        {/* Goals Grid */}
        <div className="grid gap-4">
          {filteredGoals.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-center text-gray-500">No business goals found</p>
            </div>
          ) : (
            filteredGoals.map((goal) => (
              <div key={`${goal.meetingId}-${goal.id}`} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M12 2L2 22h20L12 2z" />
                      </svg>
                      <span
                        className={`bg-${statusColors[goal.status].split(" ")[0]} text-${statusColors[goal.status].split(" ")[1]} px-2 py-1 rounded`}
                      >
                        {goal.status}
                      </span>
                      <span className="text-xs text-gray-500">{goal.code}</span>
                    </div>
                    <h3 className="font-semibold text-gray-800">{goal.description}</h3>
                    <p className="text-xs text-gray-500 mt-2">
                      Owner: <span className="font-medium">{goal.ownerName}</span> • Deadline:{" "}
                      <span className="font-medium">{new Date(goal.deadline).toLocaleDateString()}</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="bg-gray-200 text-gray-800 px-3 py-2 rounded"
                      onClick={() => handleViewDetails(goal)}
                      title="View details"
                    >
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.1 4.39 4.07 7.5 8 7.5s6.9-3.11 8-7.5c-1.73-4.39-6.07-7.5-11-7.5zm0 15c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7zm1-11h-2v6H9v2h6v-2h-2V6z" />
                      </svg>
                    </button>
                    <button
                      className="bg-gray-200 text-gray-800 px-3 py-2 rounded"
                      onClick={() => {
                        setSelectedGoal(goal)
                        setIsAssigningAction(true)
                      }}
                      title="Assign action"
                    >
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                      </svg>
                    </button>
                    <select
                      value={goal.status}
                      onChange={(e) => handleStatusChange(goal.meetingId, goal.id!, e.target.value)}
                    >
                      <option className="w-32" value="NEW">
                        New
                      </option>
                      <option value="ON_TRACK">On Track</option>
                      <option value="ISSUE">Issue</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                    <button
                      className="bg-gray-200 text-gray-800 px-3 py-2 rounded"
                      onClick={() => handleDelete(goal.meetingId, goal.id!)}
                    >
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.5-8.5h5v1h-5v-1zm0 3h5v1h-5v-1zm0 3h5v1h-5v-1z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* View Details Modal */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
          style={{ display: isViewingDetails ? "block" : "none" }}
        >
          <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Business Goal Details</h2>
            {selectedGoal && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Code</label>
                    <p className="text-gray-800">{selectedGoal.code}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <span
                      className={`bg-${statusColors[selectedGoal.status].split(" ")[0]} text-${statusColors[selectedGoal.status].split(" ")[1]} px-2 py-1 rounded`}
                    >
                      {selectedGoal.status}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="text-gray-800">{selectedGoal.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Owner</label>
                    <p className="text-gray-800 flex items-center gap-2">
                      <svg className="h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M12 2L2 22h20L12 2z" />
                      </svg>
                      {selectedGoal.ownerName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Deadline</label>
                    <p className="text-gray-800">{new Date(selectedGoal.deadline).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <button
                    className="bg-gray-200 text-gray-800 px-3 py-2 rounded"
                    onClick={() => setIsViewingDetails(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Assign Action Modal */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
          style={{ display: isAssigningAction ? "block" : "none" }}
        >
          <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Assign Action to Goal</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Action Description</label>
                <textarea
                  value={newActionDescription}
                  onChange={(e) => setNewActionDescription(e.target.value)}
                  placeholder="Describe the action..."
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Deadline</label>
                <input
                  type="date"
                  value={newActionDeadline}
                  onChange={(e) => setNewActionDeadline(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex gap-2">
                <button className="bg-blue-500 text-white px-3 py-2 rounded" onClick={handleAddActionToGoal}>
                  Assign Action
                </button>
                <button
                  className="bg-gray-200 text-gray-800 px-3 py-2 rounded"
                  onClick={() => setIsAssigningAction(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
