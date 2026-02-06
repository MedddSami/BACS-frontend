"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Action } from "@/lib/hooks/use-meetings"

interface AddActionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (action: Action) => void
  currentUserId: number
}

export default function AddActionModal({ open, onOpenChange, onSubmit, currentUserId }: AddActionModalProps) {
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "CRITICAL">("MEDIUM")
  const [deadline, setDeadline] = useState("")
  const [assignedTo, setAssignedTo] = useState("")
  const [scope, setScope] = useState("INTERNAL")

  const handleSubmit = () => {
    if (!description.trim() || !deadline || !assignedTo.trim()) return

    const code = `ACT-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`

    onSubmit({
      code,
      description,
      priority,
      deadline,
      assignedToId: Number.parseInt(assignedTo),
      assignedToName: assignedTo,
      status: "NEW",
      distributionScope: "INTERNAL",
      scope,
    })

    setDescription("")
    setPriority("MEDIUM")
    setDeadline("")
    setAssignedTo("")
    setScope("INTERNAL")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Action Item</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the action item"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                <SelectTrigger id="priority">
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
              <Label htmlFor="deadline">Deadline</Label>
              <Input id="deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedTo">Assign To (Name)</Label>
            <Input
              id="assignedTo"
              placeholder="Name of assignee"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            />
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
                <SelectItem value="PUBLIC">Public</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Action</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
