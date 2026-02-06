"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { Participant } from "@/lib/hooks/use-meetings"

interface AddAttendeeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (participant: Participant) => void
}

export default function AddAttendeeModal({ open, onOpenChange, onSubmit }: AddAttendeeModalProps) {
  const [name, setName] = useState("")
  const [attendanceMode, setAttendanceMode] = useState<"FACE_TO_FACE" | "VIRTUAL" | "HYBRID">("VIRTUAL")
  const [isChair, setIsChair] = useState(false)
  const [isRequired, setIsRequired] = useState(true)

  const handleSubmit = () => {
    if (!name.trim()) return

    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()

    onSubmit({
      userId: Math.floor(Math.random() * 10000),
      name,
      initials,
      attendanceMode,
      isChair,
      isRequired,
    })

    setName("")
    setAttendanceMode("VIRTUAL")
    setIsChair(false)
    setIsRequired(true)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Meeting Attendee</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="Enter attendee name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mode">Attendance Mode</Label>
            <Select value={attendanceMode} onValueChange={(value: any) => setAttendanceMode(value)}>
              <SelectTrigger id="mode">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FACE_TO_FACE">Face to Face</SelectItem>
                <SelectItem value="VIRTUAL">Virtual</SelectItem>
                <SelectItem value="HYBRID">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox id="chair" checked={isChair} onCheckedChange={(checked) => setIsChair(checked as boolean)} />
              <Label htmlFor="chair" className="cursor-pointer font-normal">
                Is Chair
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="required"
                checked={isRequired}
                onCheckedChange={(checked) => setIsRequired(checked as boolean)}
              />
              <Label htmlFor="required" className="cursor-pointer font-normal">
                Required Attendee
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Attendee</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
