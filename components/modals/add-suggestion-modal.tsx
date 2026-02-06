"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Suggestion } from "@/lib/hooks/use-meetings"

interface AddSuggestionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (suggestion: Suggestion) => void
  currentUserId: number
}

export default function AddSuggestionModal({ open, onOpenChange, onSubmit, currentUserId }: AddSuggestionModalProps) {
  const [description, setDescription] = useState("")
  const [expectedBenefit, setExpectedBenefit] = useState("")
  const [scope, setScope] = useState("INTERNAL")
  const [suggestedBy, setSuggestedBy] = useState("")

  const handleSubmit = () => {
    if (!description.trim() || !expectedBenefit.trim() || !suggestedBy.trim()) return

    const code = `SUG-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`

    onSubmit({
      code,
      description,
      expectedBenefit,
      distributionScope: "INTERNAL",
      scope,
      suggestedById: currentUserId,
      suggestedByName: suggestedBy,
    })

    setDescription("")
    setExpectedBenefit("")
    setScope("INTERNAL")
    setSuggestedBy("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Suggestion</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Suggestion Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your suggestion"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="benefit">Expected Benefit</Label>
            <Textarea
              id="benefit"
              placeholder="Describe the expected benefit"
              value={expectedBenefit}
              onChange={(e) => setExpectedBenefit(e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label htmlFor="suggestedBy">Suggested By</Label>
              <Input
                id="suggestedBy"
                placeholder="Your name"
                value={suggestedBy}
                onChange={(e) => setSuggestedBy(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Suggestion</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
