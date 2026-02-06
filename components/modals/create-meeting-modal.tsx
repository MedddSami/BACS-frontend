"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useMeetings } from "@/lib/hooks/use-meetings"
import { useToast } from "@/hooks/use-toast"
import type { Meeting } from "@/lib/hooks/use-meetings"
import { useAppSelector } from "@/lib/store/hooks"

interface CreateMeetingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onMeetingCreated?: (meeting: Meeting) => void
}

const PLAN_TYPES = [
  "Academic Specific Plan",
  "University Strategy Plan",
  "School Strategy Plan",
  "Research Plan",
  "Teaching Plan",
  "Quality Plan",
  "Accreditation Plan",
  "University Support Plan",
  "University Annual Plan",
  "Data Management Plan",
  "Health and Wellbeing Plan",
  "Digital Skills IS Structure IS Policies Plans",
  "Environmental Sustainability Plan",
  "Probation Plan",
]

const MEETING_TYPES = [
  "Academic Specific Plan",
  "University Strategy Plan",
  "School Strategy Plan",
  "Research Plan",
  "Teaching Plan",
  "Quality Plan",
  "Accreditation Plan",
]

export default function CreateMeetingModal({ open, onOpenChange, onMeetingCreated }: CreateMeetingModalProps) {
  const { user, requiresTwoFactor, loading } = useAppSelector(s => s.auth)
  const { addMeeting } = useMeetings()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    meetingType: "Academic Specific Plan",
    meetingMode: "HYBRID" as const,
    meetingClassification: "INTERNAL" as const,
    meetingFrequency: "Quarterly",
    committee: "",
    departmentOrCentre: "",
    scheduledAt: "",
    location: "",
    meetingUrl: "",
    affectedPlanTypes: [] as string[],
    notes: "",
  })

  const togglePlan = (plan: string) => {
    setFormData((prev) => ({
      ...prev,
      affectedPlanTypes: prev.affectedPlanTypes.includes(plan)
        ? prev.affectedPlanTypes.filter((p) => p !== plan)
        : [...prev.affectedPlanTypes, plan],
    }))
  }

  const handleCreate = async () => {
    if (!formData.title.trim() || !formData.scheduledAt) {
      setError("Please fill in required fields: Title and Date")
      toast({
        title: "Validation Error",
        description: "Please fill in required fields: Title and Date",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const newMeeting: Meeting = {
        ...formData,
        id: Math.random(),
        type: formData.meetingType,
        mode: formData.meetingMode,
        classification: formData.meetingClassification,
        date: new Date(formData.scheduledAt).toISOString().split("T")[0],
        organiser: user?.firstName,
        status: "SCHEDULED",
        participantsCount: 0,
        participants: [],
        businessGoals: [],
        actions: [],
        concerns: [],
        suggestions: [],
        frequency: formData.meetingFrequency,
        nature: "Planning",
      }

      const createdMeeting = addMeeting(newMeeting)
      onMeetingCreated?.(createdMeeting)

      toast({
        title: "Success",
        description: `Meeting "${formData.title}" created successfully`,
      })

      onOpenChange(false)
      // Reset form
      setFormData({
        title: "",
        description: "",
        meetingType: "Academic Specific Plan",
        meetingMode: "HYBRID",
        meetingClassification: "INTERNAL",
        meetingFrequency: "Quarterly",
        committee: "",
        departmentOrCentre: "",
        scheduledAt: "",
        location: "",
        meetingUrl: "",
        affectedPlanTypes: [],
        notes: "",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create meeting"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Meeting</DialogTitle>
          <DialogDescription>Set up a new meeting following the BACS+ template structure</DialogDescription>
        </DialogHeader>

        {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</div>}

        <div className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="organiser">Organiser</Label>
              <Input
                id="organiser"
                placeholder="e.g., Dr. John Smith"
                value={user?.firstName || ""}
                className="mt-1"
                disabled
              />
            </div>

            <div>
              <Label htmlFor="department">Department or Centre</Label>
              <Input
                id="department"
                placeholder="e.g., Computer Science"
                value={formData.departmentOrCentre}
                onChange={(e) => setFormData({ ...formData, departmentOrCentre: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="title">Meeting Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Q4 Planning Session"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Meeting description and objectives"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Meeting Type</Label>
              <Select
                value={formData.meetingType}
                onValueChange={(val) => setFormData({ ...formData, meetingType: val })}
              >
                <SelectTrigger id="type" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MEETING_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="mode">Mode</Label>
              <Select
                value={formData.meetingMode}
                onValueChange={(val) => setFormData({ ...formData, meetingMode: val as any })}
              >
                <SelectTrigger id="mode" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FACE_TO_FACE">Face-to-Face</SelectItem>
                  <SelectItem value="VIRTUAL">Virtual</SelectItem>
                  <SelectItem value="HYBRID">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="classification">Classification</Label>
              <Select
                value={formData.meetingClassification}
                onValueChange={(val) => setFormData({ ...formData, meetingClassification: val as any })}
              >
                <SelectTrigger id="classification" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INTERNAL">Internal</SelectItem>
                  <SelectItem value="CONFIDENTIAL">Confidential</SelectItem>
                  <SelectItem value="PUBLIC">Public</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="frequency">Frequency</Label>
              <Select
                value={formData.meetingFrequency}
                onValueChange={(val) => setFormData({ ...formData, meetingFrequency: val })}
              >
                <SelectTrigger id="frequency" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Bi-Weekly">Bi-Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                  <SelectItem value="Ad-Hoc">Ad-Hoc</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="committee">Committee</Label>
              <Input
                id="committee"
                placeholder="e.g., Executive Committee"
                value={formData.committee}
                onChange={(e) => setFormData({ ...formData, committee: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="datetime">Scheduled Date & Time *</Label>
              <Input
                id="datetime"
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., Conference Room A"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="url">Meeting URL (optional)</Label>
              <Input
                id="url"
                placeholder="e.g., https://zoom.us/j/..."
                value={formData.meetingUrl}
                onChange={(e) => setFormData({ ...formData, meetingUrl: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>

          {/* Affected Plans */}
          <div>
            <Label className="mb-2 block">Affected Plans</Label>
            <div className="max-h-48 overflow-y-auto rounded-md border border-border p-4 space-y-2">
              {PLAN_TYPES.map((plan) => (
                <div key={plan} className="flex items-center gap-2">
                  <Checkbox
                    id={plan}
                    checked={formData.affectedPlanTypes.includes(plan)}
                    onCheckedChange={() => togglePlan(plan)}
                  />
                  <label htmlFor={plan} className="text-sm cursor-pointer">
                    {plan}
                  </label>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {formData.affectedPlanTypes.length} plan{formData.affectedPlanTypes.length !== 1 ? "s" : ""} selected
            </p>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes or context for this meeting"
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="mt-1"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1" disabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Meeting"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
