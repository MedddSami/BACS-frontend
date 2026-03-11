import { ActionItemResponse } from "../actionItem/actionItemType"
import { UserResponse } from "../auth/authTypes"
import { Concern } from "../concern/ConcernTypes"
import { MeetingResponse } from "../meeting/meetingType"

export interface DashboardStats {
  totalActions: number
  openActions: number
  inProgressActions: number
  completedActions: number
  overdueActions: number
  upcomingMeetingsCount: number
  unresolvedConcernsCount: number
}

export interface DashboardResponse {
  user: UserResponse
  stats: DashboardStats
  myActions: ActionItemResponse[]
  upcomingMeetings: MeetingResponse[]
  unresolvedConcerns: Concern[]
}