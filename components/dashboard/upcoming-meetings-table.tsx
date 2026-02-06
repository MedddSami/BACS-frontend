"use client"

import { useMeetings } from "@/lib/hooks/use-meetings"
import { Badge } from "@/components/ui/badge"

const typeColorMap: Record<string, string> = {
  "Academic Specific Plan": "bg-blue-100 text-blue-800",
  "University Strategy Plan": "bg-purple-100 text-purple-800",
  "School Strategy Plan": "bg-indigo-100 text-indigo-800",
  "Research Plan": "bg-cyan-100 text-cyan-800",
  "Teaching Plan": "bg-green-100 text-green-800",
  "Quality Plan": "bg-amber-100 text-amber-800",
  "Accreditation Plan": "bg-rose-100 text-rose-800",
  "University Support Plan": "bg-teal-100 text-teal-800",
  "University Annual Plan": "bg-fuchsia-100 text-fuchsia-800",
}

export default function UpcomingMeetingsTable() {
  const { meetings } = useMeetings()

  const upcomingMeetings = meetings.filter((m) => new Date(m.scheduledAt) > new Date()).slice(0, 5)

  if (upcomingMeetings.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No upcoming meetings</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="px-4 py-2 text-left font-semibold text-foreground">Meeting Name</th>
            <th className="px-4 py-2 text-left font-semibold text-foreground">Date</th>
            <th className="px-4 py-2 text-left font-semibold text-foreground">Type</th>
          </tr>
        </thead>
        <tbody>
          {upcomingMeetings.map((meeting) => (
            <tr key={meeting.id} className="border-b border-border hover:bg-muted/50 transition-colors">
              <td className="px-4 py-3 text-foreground font-medium">{meeting.title}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {new Date(meeting.scheduledAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </td>
              <td className="px-4 py-3">
                <Badge className={typeColorMap[meeting.meetingType] || "bg-gray-100 text-gray-800"}>
                  {meeting.meetingType}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
