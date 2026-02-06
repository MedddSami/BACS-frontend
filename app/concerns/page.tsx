"use client"

import { useState } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { useMeetings } from "@/lib/hooks/use-meetings"
import { useToast } from "@/hooks/use-toast"

const severityColors: Record<string, string> = {
  LOW: "bg-blue-100 text-blue-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HIGH: "bg-orange-100 text-orange-800",
  CRITICAL: "bg-red-100 text-red-800",
}

const severityIcon: Record<string, string> = {
  LOW: "text-blue-600",
  MEDIUM: "text-yellow-600",
  HIGH: "text-orange-600",
  CRITICAL: "text-red-600",
}

export default function ConcernsPage() {
  const {
    meetings,
    addConcernToMeeting,
    updateConcern,
    deleteConcern,
    escalateConcern,
    linkActionsToConcern,
    concerns,
  } = useMeetings()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [isAdding, setIsAdding] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState<number | null>(null)
  const [selectedConcern, setSelectedConcern] = useState<any>(null)
  const [isViewingDetails, setIsViewingDetails] = useState(false)
  const [isResolvingConcern, setIsResolvingConcern] = useState(false)
  const [resolutionText, setResolutionText] = useState("")
  const [isLinkingActions, setIsLinkingActions] = useState(false)
  const [selectedActionIds, setSelectedActionIds] = useState<number[]>([])
  const [formData, setFormData] = useState({
    description: "",
    impact: "",
    severityRating: "MEDIUM" as const,
  })

  const allConcerns = Array.isArray(concerns) ? concerns : []
  console.log("[v0] All concerns:", allConcerns)

  const filteredConcerns = allConcerns.filter((concern) => {
    const matchesSearch = concern.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSeverity = severityFilter === "all" || concern.severityRating === severityFilter
    return matchesSearch && matchesSeverity
  })

  const handleAddConcern = () => {
    if (!selectedMeeting || !formData.description || !formData.impact) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const newConcern = {
      code: `CON-${String(allConcerns.length + 1).padStart(3, "0")}`,
      description: formData.description,
      impact: formData.impact,
      severityRating: formData.severityRating,
      distributionScope: "INTERNAL" as const,
      scope: "Team",
      raisedById: 1,
      raisedByName: "Current User",
      id: Math.max(...allConcerns.map((c) => c.id || 0), 0) + 1,
    }

    addConcernToMeeting(selectedMeeting, newConcern)
    setFormData({
      description: "",
      impact: "",
      severityRating: "MEDIUM",
    })
    setSelectedMeeting(null)
    setIsAdding(false)
    toast({
      title: "Success",
      description: "Concern added successfully",
    })
  }

  const handleViewDetails = (concern: any) => {
    setSelectedConcern(concern)
    setIsViewingDetails(true)
  }

  const handleResolveConcern = () => {
    if (!resolutionText.trim() || !selectedConcern) {
      toast({
        title: "Error",
        description: "Please enter resolution details",
        variant: "destructive",
      })
      return
    }

    updateConcern(selectedConcern.meetingId, selectedConcern.id, {
      resolution: resolutionText,
    })
    setIsResolvingConcern(false)
    setResolutionText("")
    setIsViewingDetails(false)
    toast({
      title: "Success",
      description: "Concern resolved successfully",
    })
  }

  const handleLinkActions = () => {
    if (selectedActionIds.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one action",
        variant: "destructive",
      })
      return
    }

    linkActionsToConcern(selectedConcern.meetingId, selectedConcern.id, selectedActionIds)
    setIsLinkingActions(false)
    setSelectedActionIds([])
    toast({
      title: "Success",
      description: "Actions linked to concern successfully",
    })
  }

  const handleEscalate = (meetingId: number, concernId: number) => {
    const concern = allConcerns.find((c) => c.id === concernId)
    if (!concern) return

    const severityLevels = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    const currentIndex = severityLevels.indexOf(concern.severityRating)
    if (currentIndex < severityLevels.length - 1) {
      const newSeverity = severityLevels[currentIndex + 1] as any
      escalateConcern(meetingId, concernId, newSeverity)
      toast({
        title: "Success",
        description: `Concern escalated to ${newSeverity}`,
      })
    }
  }

  const handleDelete = (meetingId: number, concernId: number) => {
    deleteConcern(meetingId, concernId)
    toast({
      title: "Success",
      description: "Concern deleted successfully",
    })
  }

  const availableActions = selectedConcern
    ? meetings.find((m) => m.id === selectedConcern.meetingId)?.actions || []
    : []

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground text-balance">Concerns & Risks</h2>
            <p className="text-muted-foreground mt-1">Track and manage all concerns raised in meetings</p>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <span>+</span> Add Concern
          </button>
        </div>

        {isAdding && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Concern</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Meeting</label>
                  <select
                    value={selectedMeeting || ""}
                    onChange={(e) => setSelectedMeeting(e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the concern..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Impact</label>
                  <textarea
                    value={formData.impact}
                    onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                    placeholder="Describe the potential impact..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                  <select
                    value={formData.severityRating}
                    onChange={(e) => setFormData({ ...formData, severityRating: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleAddConcern}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Add Concern
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

        {/* Concerns Grid */}
        <div className="space-y-4">
          {filteredConcerns.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {searchQuery || severityFilter !== "all" ? "No concerns match your filters" : "No concerns added yet"}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredConcerns.map((concern) => (
                <div
                  key={concern.id}
                  className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedConcern(concern)
                    setIsViewingDetails(true)
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-gray-600">{concern.code}</span>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${severityColors[concern.severityRating]}`}
                        >
                          {concern.severityRating}
                        </span>
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
                          {concern.status || "OPEN"}
                        </span>
                      </div>
                      <p className="text-gray-900 font-medium mb-1">{concern.description}</p>
                      <p className="text-sm text-gray-600">{concern.impact}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEscalate(concern.meetingId, concern.id)
                        }}
                        className="text-gray-600 hover:text-gray-800 p-2"
                      >
                        <span>↑</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteConcern(concern.id || 0)
                          toast({
                            title: "Success",
                            description: "Concern deleted successfully",
                          })
                        }}
                        className="text-red-600 hover:text-red-800 p-2"
                      >
                        <span>×</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
