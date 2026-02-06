"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { BusinessGoal } from "@/lib/hooks/use-meetings"

interface AddBusinessGoalModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (goal: BusinessGoal) => void
  currentUserId: number
}

export default function AddBusinessGoalModal({
  open,
  onOpenChange,
  onSubmit,
  currentUserId,
}: AddBusinessGoalModalProps) {
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<"NEW" | "ON_TRACK" | "ISSUE" | "COMPLETED">("NEW")
  const [deadline, setDeadline] = useState("")
  const [owner, setOwner] = useState("")

  const handleSubmit = () => {
    if (!description.trim() || !deadline || !owner.trim()) return

    const code = `BG-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`

    onSubmit({
      code,
      description,
      status,
      deadline,
      ownerId: currentUserId,
      ownerName: owner,
    })

    setDescription("")
    setStatus("NEW")
    setDeadline("")
    setOwner("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Business Goal</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Goal Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the business goal"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NEW">New</SelectItem>
                  <SelectItem value="ON_TRACK">On Track</SelectItem>
                  <SelectItem value="ISSUE">Issue</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input id="deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="owner">Goal Owner (Name)</Label>
            <Input
              id="owner"
              placeholder="Name of goal owner"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Goal</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
