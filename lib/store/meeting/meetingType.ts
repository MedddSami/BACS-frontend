export type MeetingType = 
    | "KICKOFF"
    | "STATUS_REVIEW"
    | "SPRINT_PLANNING"
    | "SPRINT_REVIEW"
    | "SPRINT_RETROSPECTIVE"
    | "STAKEHOLDER_MEETING"
    | "RISK_REVIEW"
    | "CHANGE_CONTROL_BOARD"
    | "QUALITY_ASSURANCE"
    | "STEERING_COMMITTEE"
    | "DAILY_STANDUP"
    | "TEAM_SYNC"
    | "CLIENT_PRESENTATION"
    | "TRAINING_SESSION"
    | "ONE_ON_ONE"
    | "ALL_HANDS"
    | "OTHER"

export type MeetingMode = "FACE_TO_FACE" | "VIRTUAL" | "HYBRID"

export type MeetingClassification = "INTERNAL" | "CONFIDENTIAL" | "PUBLIC" | "RESTRICTED"

export type MeetingFrequency = 
  | "DAILY"
  | "WEEKLY"
  | "BIWEEKLY"
  | "MONTHLY"
  | "QUARTERLY"
  | "ANNUALLY"
  | "AD_HOC"


export interface MeetingResponse {
  id: number
  title: string
  description?: string
  meetingType: MeetingType
  scheduledAt: string
  startedAt?: string
  endedAt?: string
  location?: string
  meetingUrl?: string
  participantCount: number
  actionItemCount: number
  concernCount: number
  suggestionCount: number
  hasTranscript: boolean
  createdAt: string
}

export interface MeetingDetailResponse {
  id: number
  title: string
  description?: string
  meetingType: MeetingType
  scheduledAt: string
  startedAt?: string
  endedAt?: string
  location?: string
  meetingUrl?: string
  participants: any[]
  actionItems: any[]
  concerns: any[]
  suggestions: any[]
  transcript?: any
  createdAt: string
  updatedAt: string
}


export interface CreateMeetingRequest {
  title: string
  description?: string
  meetingType: MeetingType
  meetingMode?: MeetingMode
  meetingClassification?: MeetingClassification
  meetingFrequency?: MeetingFrequency
  meetingNature?: string
  committee?: string
  departmentOrCentre?: string
  scheduledAt: string
  location?: string
  meetingUrl?: string
  notes?: string
  nextMeetingDate?: string
  nextMeetingMode?: MeetingMode
  participants: ParticipantRequest[]
  organizerId?: number
  affectedPlanTypes?: string[]
}

export interface ParticipantRequest {
  userId: number
  isChair: boolean
  isRequired: boolean
  attendanceMode: MeetingMode
}


export interface UpdateMeetingRequest {
  title?: string
  description?: string
  meetingType?: MeetingType
  scheduledAt?: string
  startedAt?: string
  endedAt?: string
  location?: string
  meetingUrl?: string
}
