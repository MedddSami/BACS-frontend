"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from "lucide-react"
import type { MeetingTranscript } from "@/lib/hooks/use-meetings"

interface TranscriptUploadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (transcript: MeetingTranscript) => void
  currentUserId: number
  meetingId: number
}

export default function TranscriptUploadModal({
  open,
  onOpenChange,
  onSubmit,
  currentUserId,
  meetingId,
}: TranscriptUploadModalProps) {
  const [fileName, setFileName] = useState("")
  const [fileType, setFileType] = useState<"TEXT" | "AUDIO">("TEXT")
  const [content, setContent] = useState("")

  const handleSubmit = () => {
    if (!fileName.trim() || !content.trim()) return

    const transcript: MeetingTranscript = {
      meetingId,
      fileName,
      fileType,
      content,
      uploadedAt: new Date().toISOString(),
      uploadedByUserId: currentUserId,
      uploadedByName: "Current User",
    }

    onSubmit(transcript)

    setFileName("")
    setFileType("TEXT")
    setContent("")
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)

    // Determine file type based on extension
    if (file.type.startsWith("audio/")) {
      setFileType("AUDIO")
    } else {
      setFileType("TEXT")
    }

    // For text files, read content
    if (file.type.includes("text") || file.name.endsWith(".txt")) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setContent(event.target?.result as string)
      }
      reader.readAsText(file)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Meeting Transcript</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">File Upload</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                accept=".txt,.pdf,audio/*"
                onChange={handleFileSelect}
                className="cursor-pointer"
              />
              <Upload className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fileName">File Name</Label>
            <Input
              id="fileName"
              placeholder="Transcript file name"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fileType">File Type</Label>
            <Select value={fileType} onValueChange={(value: any) => setFileType(value)}>
              <SelectTrigger id="fileType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TEXT">Text Transcript</SelectItem>
                <SelectItem value="AUDIO">Audio Recording</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Transcript Content / Notes</Label>
            <Textarea
              id="content"
              placeholder="Paste transcript content or meeting notes here. The system will automatically analyze and extract business goals, actions, concerns, and suggestions."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
            />
            <p className="text-xs text-muted-foreground">
              Tip: Include keywords like 'goal', 'action', 'concern', 'risk', 'suggest', 'recommend' for better
              extraction.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Upload & Analyze</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
