"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Concern } from "@/lib/hooks/use-meetings"

interface AddConcernModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (concern: Concern) => void
  currentUserId: number
}

export default function AddConcernModal({ open, onOpenChange, onSubmit, currentUserId }: AddConcernModalProps) {
  const [description, setDescription] = useState("")
  const [impact, setImpact] = useState("")
  const [severity, setSeverity] = useState<"LOW" | "MEDIUM" | "HIGH" | "CRITICAL">("MEDIUM")
  const [scope, setScope] = useState("INTERNAL")

  const handleSubmit = () => {
    if (!description.trim() || !impact.trim()) return

    const code = `CON-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`

    onSubmit({
      code,
      description,
      impact,
      severityRating: severity,
      distributionScope: "INTERNAL",
      scope,
      raisedById: currentUserId,
      raisedByName: "Current User",
    })

    setDescription("")
    setImpact("")
    setSeverity("MEDIUM")
    setScope("INTERNAL")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Concern</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Concern Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the concern"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="impact">Potential Impact</Label>
            <Textarea
              id="impact"
              placeholder="Describe the potential impact"
              value={impact}
              onChange={(e) => setImpact(e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="severity">Severity</Label>
              <Select value={severity} onValueChange={(value: any) => setSeverity(value)}>
                <SelectTrigger id="severity">
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

            <div className="space-y-2">
              <Label htmlFor="scope">Scope</Label>
              <Select value={scope} onValueChange={setScope}>
                <SelectTrigger id="scope">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INTERNAL">Internal</SelectItem>
                  <SelectItem value="TEAM_ONLY">Team Only</SelectItem>
                  <SelectItem value="CONFIDENTIAL">Confidential</SelectItem>
                  <SelectItem value="PUBLIC">Public</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Concern</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
