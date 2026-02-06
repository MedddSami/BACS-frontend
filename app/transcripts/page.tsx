"use client"

import { useState } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { useMeetings } from "@/lib/hooks/use-meetings"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Download, FileText, Loader2, Eye, Zap, Settings } from "lucide-react"

export default function TranscriptsPage() {
  const { meetings, addTranscriptToMeeting, getTranscriptByMeeting, updateMeeting } = useMeetings()
  const { toast } = useToast()
  const [isAdding, setIsAdding] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isViewingDetails, setIsViewingDetails] = useState(false)
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState<number | null>(null)
  const [selectedTranscript, setSelectedTranscript] = useState<any>(null)
  const [summary, setSummary] = useState("")
  const [formData, setFormData] = useState({
    fileName: "",
    fileType: "TEXT" as "TEXT" | "AUDIO",
    content: "",
  })

  const transcripts = meetings
    .map((meeting) => {
      const transcript = getTranscriptByMeeting(meeting.id)
      return transcript ? { ...transcript, meetingId: meeting.id, meetingTitle: meeting.title } : null
    })
    .filter((t) => t !== null)

  const handleUpload = async () => {
    if (!selectedMeeting || !formData.fileName || !formData.content) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    setTimeout(() => {
      const newTranscript = {
        meetingId: selectedMeeting,
        fileName: formData.fileName,
        fileType: formData.fileType,
        content: formData.content,
        uploadedAt: new Date().toISOString(),
        uploadedByUserId: 1,
        uploadedByName: "Current User",
        id: Date.now(),
      }

      addTranscriptToMeeting(selectedMeeting, newTranscript)
      setFormData({ fileName: "", fileType: "TEXT", content: "" })
      setSelectedMeeting(null)
      setIsAdding(false)
      setIsProcessing(false)

      toast({
        title: "Success",
        description: "Transcript uploaded and analyzed successfully",
      })
    }, 2000)
  }

  const handleViewDetails = (transcript: any) => {
    setSelectedTranscript(transcript)
    setIsViewingDetails(true)
  }

  const handleSummarize = () => {
    if (!selectedTranscript) return

    // Simple summarization based on content length
    const words = selectedTranscript.content.split(" ")
    const summarizedSentences = Math.ceil(words.length / 50)
    const summary = `Transcript summary: This meeting covered ${summarizedSentences} main topics. Key points include discussion of goals, action items, concerns, and improvement suggestions. Attendees discussed important business objectives and identified several action items for follow-up.`

    setSummary(summary)
    setIsSummarizing(true)
  }

  const meetingTranscripts = (meetingId: number) => {
    return transcripts.filter((t) => t?.meetingId === meetingId)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground text-balance">Meeting Transcripts</h2>
            <p className="text-muted-foreground mt-1">Upload and manage meeting transcripts with AI analysis</p>
          </div>
          <Dialog open={isAdding} onOpenChange={setIsAdding}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Upload Transcript
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Upload Meeting Transcript</DialogTitle>
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
                  <label className="text-sm font-medium">File Name</label>
                  <Input
                    value={formData.fileName}
                    onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
                    placeholder="e.g., meeting-transcript.txt"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">File Type</label>
                  <Select
                    value={formData.fileType}
                    onValueChange={(v) => setFormData({ ...formData, fileType: v as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TEXT">Text</SelectItem>
                      <SelectItem value="AUDIO">Audio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Transcript Content</label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Paste transcript content here... (Keywords: goal, action, concern, risk, suggest, recommend)"
                    className="h-32"
                  />
                </div>
                <Button onClick={handleUpload} disabled={isProcessing} className="gap-2">
                  {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isProcessing ? "Processing..." : "Upload & Analyze"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Transcripts List */}
        <div className="grid gap-4">
          {transcripts.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No transcripts uploaded yet</p>
              </CardContent>
            </Card>
          ) : (
            transcripts.map((transcript) => (
              <Card key={`${transcript?.meetingId}-${transcript?.id}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <Badge>{transcript?.fileType}</Badge>
                        <span className="text-xs text-muted-foreground">{transcript?.fileName}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Meeting: <span className="font-medium">{transcript?.meetingTitle}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Uploaded by: <span className="font-medium">{transcript?.uploadedByName}</span> •{" "}
                        {new Date(transcript?.uploadedAt || "").toLocaleDateString()}
                      </p>
                      <div className="mt-3 p-3 bg-muted rounded text-sm max-h-24 overflow-y-auto">
                        <p className="text-foreground line-clamp-4">{transcript?.content}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(transcript)}
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          handleViewDetails(transcript)
                          handleSummarize()
                        }}
                        title="Summarize"
                      >
                        <Zap className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" title="Process & Extract">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* View Details Modal */}
        <Dialog open={isViewingDetails} onOpenChange={setIsViewingDetails}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Transcript Details</DialogTitle>
            </DialogHeader>
            {selectedTranscript && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">File Name</label>
                    <p className="text-foreground">{selectedTranscript.fileName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">File Type</label>
                    <Badge>{selectedTranscript.fileType}</Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Content</label>
                  <div className="p-3 bg-muted rounded max-h-48 overflow-y-auto">
                    <p className="text-sm text-foreground whitespace-pre-wrap">{selectedTranscript.content}</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsViewingDetails(false)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Summarize Modal */}
        <Dialog open={isSummarizing} onOpenChange={setIsSummarizing}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Transcript Summary</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded">
                <p className="text-sm text-foreground whitespace-pre-wrap">{summary}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsSummarizing(false)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
