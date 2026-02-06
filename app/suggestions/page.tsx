"use client"

import { useState } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { useMeetings } from "@/lib/hooks/use-meetings"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Lightbulb, Eye, LinkIcon, CheckCircle, XCircle } from "lucide-react"

export default function SuggestionsPage() {
  const {
    meetings,
    addSuggestionToMeeting,
    updateSuggestion,
    deleteSuggestion,
    rejectSuggestion,
    implementSuggestion,
    getSuggestionsByUser,
    linkActionsToConcern,
    addActionToMeeting,
  } = useMeetings()
  const { toast } = useToast() // Declare useToast hook
  const [searchQuery, setSearchQuery] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [isViewingDetails, setIsViewingDetails] = useState(false)
  const [isImplementing, setIsImplementing] = useState(false)
  const [isLinkingActions, setIsLinkingActions] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState<number | null>(null)
  const [selectedSuggestion, setSelectedSuggestion] = useState<any>(null)
  const [implementationNotes, setImplementationNotes] = useState("")
  const [selectedActionIds, setSelectedActionIds] = useState<number[]>([])
  const [formData, setFormData] = useState({
    description: "",
    expectedBenefit: "",
  })

  const allSuggestions = meetings.flatMap((meeting) =>
    (meeting.suggestions || []).map((suggestion) => ({
      ...suggestion,
      meetingId: meeting.id,
      meetingTitle: meeting.title,
    })),
  )

  const filteredSuggestions = allSuggestions.filter((suggestion) => {
    const matchesSearch = suggestion.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const handleAddSuggestion = () => {
    if (!selectedMeeting || !formData.description || !formData.expectedBenefit) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const newSuggestion = {
      code: `SUG-${String(allSuggestions.length + 1).padStart(3, "0")}`,
      description: formData.description,
      expectedBenefit: formData.expectedBenefit,
      distributionScope: "INTERNAL" as const,
      scope: "Team",
      suggestedById: 1,
      suggestedByName: "Current User",
      id: Math.max(...allSuggestions.map((s) => s.id || 0), 0) + 1,
    }

    addSuggestionToMeeting(selectedMeeting, newSuggestion)
    setFormData({ description: "", expectedBenefit: "" })
    setSelectedMeeting(null)
    setIsAdding(false)
    toast({
      title: "Success",
      description: "Suggestion added successfully",
    })
  }

  const handleViewDetails = (suggestion: any) => {
    setSelectedSuggestion(suggestion)
    setIsViewingDetails(true)
  }

  const handleImplementSuggestion = () => {
    if (!implementationNotes.trim() || !selectedSuggestion) {
      toast({
        title: "Error",
        description: "Please enter implementation notes",
        variant: "destructive",
      })
      return
    }

    implementSuggestion(selectedSuggestion.meetingId, selectedSuggestion.id, implementationNotes)
    setIsImplementing(false)
    setImplementationNotes("")
    setIsViewingDetails(false)
    toast({
      title: "Success",
      description: "Suggestion marked for implementation",
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

    updateSuggestion(selectedSuggestion.meetingId, selectedSuggestion.id, {
      relatedActionIds: selectedActionIds,
    })
    setIsLinkingActions(false)
    setSelectedActionIds([])
    toast({
      title: "Success",
      description: "Actions linked to suggestion successfully",
    })
  }

  const handleReject = (meetingId: number, suggestionId: number) => {
    rejectSuggestion(meetingId, suggestionId)
    toast({
      title: "Success",
      description: "Suggestion rejected",
    })
  }

  const handleDelete = (meetingId: number, suggestionId: number) => {
    deleteSuggestion(meetingId, suggestionId)
    toast({
      title: "Success",
      description: "Suggestion deleted successfully",
    })
  }

  const availableActions = selectedSuggestion
    ? meetings.find((m) => m.id === selectedSuggestion.meetingId)?.actions || []
    : []

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground text-balance">Suggestions</h2>
            <p className="text-muted-foreground mt-1">Manage improvement suggestions from meetings</p>
          </div>
          <Dialog open={isAdding} onOpenChange={setIsAdding}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Suggestion
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Suggestion</DialogTitle>
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
                  <label className="text-sm font-medium">Suggestion Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your suggestion..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Expected Benefit</label>
                  <Textarea
                    value={formData.expectedBenefit}
                    onChange={(e) => setFormData({ ...formData, expectedBenefit: e.target.value })}
                    placeholder="What benefits will this provide..."
                  />
                </div>
                <Button onClick={handleAddSuggestion}>Create Suggestion</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <Input
            placeholder="Search suggestions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
        </div>

        {/* Suggestions Grid */}
        <div className="grid gap-4">
          {filteredSuggestions.map((suggestion) => (
            <Card key={`${suggestion.meetingId}-${suggestion.id}`}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Lightbulb className="h-5 w-5 text-yellow-600" />
                        <span className="text-xs text-muted-foreground">{suggestion.code}</span>
                      </div>
                      <h3 className="font-semibold text-foreground">{suggestion.description}</h3>
                      <p className="text-sm text-muted-foreground mt-1">Benefit: {suggestion.expectedBenefit}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        By: <span className="font-medium">{suggestion.suggestedByName}</span>
                      </p>
                      {suggestion.relatedActionIds && suggestion.relatedActionIds.length > 0 && (
                        <div className="mt-2 flex gap-1 flex-wrap">
                          {suggestion.relatedActionIds.map((actionId) => (
                            <Badge key={actionId} variant="outline">
                              Action {actionId}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(suggestion)}
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedSuggestion(suggestion)
                          setIsLinkingActions(true)
                        }}
                        title="Link actions"
                      >
                        <LinkIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedSuggestion(suggestion)
                          setIsImplementing(true)
                        }}
                        className="text-green-600"
                        title="Implement"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(suggestion.meetingId, suggestion.id!)}
                        className="text-red-600"
                        title="Reject"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(suggestion.meetingId, suggestion.id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {suggestion.implementationNotes && (
                    <div className="pt-2 border-t">
                      <p className="text-xs font-medium text-muted-foreground">
                        Notes: {suggestion.implementationNotes}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View Details Modal */}
        <Dialog open={isViewingDetails} onOpenChange={setIsViewingDetails}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Suggestion Details</DialogTitle>
            </DialogHeader>
            {selectedSuggestion && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Code</label>
                  <p className="text-foreground">{selectedSuggestion.code}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="text-foreground">{selectedSuggestion.description}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Expected Benefit</label>
                  <p className="text-foreground">{selectedSuggestion.expectedBenefit}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Suggested By</label>
                  <p className="text-foreground">{selectedSuggestion.suggestedByName}</p>
                </div>
                {selectedSuggestion.implementationNotes && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Implementation Notes</label>
                    <p className="text-foreground">{selectedSuggestion.implementationNotes}</p>
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

        {/* Implement Suggestion Modal */}
        <Dialog open={isImplementing} onOpenChange={setIsImplementing}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Implement Suggestion</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Implementation Notes</label>
                <Textarea
                  value={implementationNotes}
                  onChange={(e) => setImplementationNotes(e.target.value)}
                  placeholder="Describe how the suggestion will be implemented..."
                  className="h-32"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleImplementSuggestion}>Implement</Button>
                <Button variant="outline" onClick={() => setIsImplementing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Link Actions Modal */}
        <Dialog open={isLinkingActions} onOpenChange={setIsLinkingActions}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Link Actions to Suggestion</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {availableActions.length === 0 ? (
                <p className="text-muted-foreground">No actions available for this meeting</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {availableActions.map((action) => (
                    <label
                      key={action.id}
                      className="flex items-center gap-2 p-2 border rounded hover:bg-muted cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedActionIds.includes(action.id!)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedActionIds([...selectedActionIds, action.id!])
                          } else {
                            setSelectedActionIds(selectedActionIds.filter((id) => id !== action.id!))
                          }
                        }}
                      />
                      <span className="text-sm">{action.description}</span>
                    </label>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={handleLinkActions}>Link Selected Actions</Button>
                <Button variant="outline" onClick={() => setIsLinkingActions(false)}>
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
