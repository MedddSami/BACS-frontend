"use client"

import { useState, useCallback, useEffect } from "react"

export interface Participant {
  userId: number
  isChair: boolean
  isRequired: boolean
  attendanceMode: "FACE_TO_FACE" | "VIRTUAL" | "HYBRID"
  initials: string
  name?: string
}

export interface BusinessGoal {
  id?: number
  code: string
  description: string
  status: "NEW" | "ISSUE" | "ON_TRACK" | "COMPLETED"
  deadline: string
  timeAllocated?: number
  ownerId: number
  ownerName?: string
  notes?: string
}

export interface Action {
  id?: number
  code: string
  description: string
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  distributionScope: "INTERNAL" | "CONFIDENTIAL" | "TEAM_ONLY" | "PUBLIC"
  scope: string
  deadline: string
  assignedToId: number
  assignedToName?: string
  status: "NEW" | "IN_PROGRESS" | "COMPLETED" | "ON_HOLD"
  notes?: string
}

export interface Concern {
  id?: number
  code: string
  description: string
  impact: string
  severityRating: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  distributionScope: "INTERNAL" | "CONFIDENTIAL" | "TEAM_ONLY" | "PUBLIC"
  scope: string
  raisedById: number
  raisedByName?: string
  relatedActionIds?: number[]
  resolution?: string
  status: "OPEN" | "ESCALATED" | "RESOLVED" | "IN_PROGRESS"
  raisedDate?: string
  linkedMeetingId?: number
  linkedMeetingTitle?: string
  linkedActions?: number[]
  resolutionNotes?: string
  resolvedAt?: string | null
}

export interface Suggestion {
  id?: number
  code: string
  description: string
  expectedBenefit: string
  distributionScope: "INTERNAL" | "CONFIDENTIAL" | "TEAM_ONLY" | "PUBLIC"
  scope: string
  suggestedById: number
  suggestedByName?: string
  relatedActionIds?: number[]
  relatedPlanIds?: number[]
  implementationNotes?: string
}

export interface Meeting {
  id: number
  title: string
  description: string
  meetingType: string
  meetingMode: "FACE_TO_FACE" | "VIRTUAL" | "HYBRID"
  meetingClassification: "INTERNAL" | "CONFIDENTIAL" | "PUBLIC"
  meetingFrequency: string
  committee: string
  departmentOrCentre: string
  scheduledAt: string
  location: string
  meetingUrl?: string
  participants: Participant[]
  affectedPlanTypes: string[]
  notes?: string
  businessGoals: BusinessGoal[]
  actions: Action[]
  concerns: Concern[]
  suggestions: Suggestion[]
  type: string
  mode: string
  classification: string
  date: string
  organiser?: string
  department?: string
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED"
  frequency?: string
  nature?: string
  nextMeetingDate?: string
  nextMeetingMode?: string
  agenda?: string
  participantsCount: number
  transcript?: MeetingTranscript
}

export interface MeetingTranscript {
  id?: number
  meetingId: number
  filename: string
  fileType: "TEXT" | "AUDIO"
  content: string
  uploadedAt: string
  uploadedById: number
  uploadedByName?: string
  summary?: string
  extractedData?: {
    extractedBusinessGoals: BusinessGoal[]
    extractedActions: Action[]
    extractedConcerns: Concern[]
    extractedSuggestions: Suggestion[]
  }
}

const mockMeetings: Meeting[] = [
  {
    id: 1,
    title: "Academic Planning Meeting",
    description: "Quarterly planning for academic year 2024-2025",
    meetingType: "Academic Specific Plan",
    meetingMode: "HYBRID",
    meetingClassification: "INTERNAL",
    meetingFrequency: "Quarterly",
    committee: "Academic Affairs",
    departmentOrCentre: "Faculty of Science",
    scheduledAt: "2025-01-15T10:00:00",
    location: "Conference Room A",
    meetingUrl: "https://zoom.us/meeting/123456",
    participants: [
      { userId: 1, isChair: true, isRequired: true, attendanceMode: "HYBRID", initials: "JD", name: "John Doe" },
      { userId: 2, isChair: false, isRequired: true, attendanceMode: "VIRTUAL", initials: "JS", name: "Jane Smith" },
    ],
    affectedPlanTypes: ["Academic Specific Plan", "Teaching Plan"],
    notes: "Discuss curriculum updates and faculty hiring",
    businessGoals: [
      {
        id: 1,
        code: "BG-001",
        description: "Improve student engagement by 25%",
        status: "ON_TRACK",
        deadline: "2025-06-30",
        ownerId: 1,
        ownerName: "John Doe",
      },
    ],
    actions: [
      {
        id: 1,
        code: "ACT-001",
        description: "Update curriculum documents",
        priority: "HIGH",
        distributionScope: "INTERNAL",
        scope: "Faculty",
        deadline: "2025-02-28",
        assignedToId: 2,
        assignedToName: "Jane Smith",
        status: "IN_PROGRESS",
      },
    ],
    concerns: [
      {
        id: 1,
        code: "CON-001",
        description: "Budget constraints for new resources",
        impact: "May limit new initiatives",
        severityRating: "MEDIUM",
        distributionScope: "CONFIDENTIAL",
        scope: "Leadership",
        raisedById: 1,
        raisedByName: "John Doe",
      },
    ],
    suggestions: [
      {
        id: 1,
        code: "SUG-001",
        description: "Implement online learning platform",
        expectedBenefit: "Increase accessibility and engagement",
        distributionScope: "INTERNAL",
        scope: "Faculty",
        suggestedById: 2,
        suggestedByName: "Jane Smith",
      },
    ],
    type: "Academic",
    mode: "HYBRID",
    classification: "INTERNAL",
    date: "2025-01-15",
    organiser: "John Doe",
    department: "Faculty of Science",
    status: "SCHEDULED",
    frequency: "Quarterly",
    nature: "Planning",
    participantsCount: 2,
  },
  {
    id: 2,
    title: "Research Strategy Review",
    description: "Annual review of research initiatives",
    meetingType: "Research Plan",
    meetingMode: "VIRTUAL",
    meetingClassification: "CONFIDENTIAL",
    meetingFrequency: "Annual",
    committee: "Research Council",
    departmentOrCentre: "Faculty of Engineering",
    scheduledAt: "2025-02-20T14:00:00",
    location: "Virtual",
    meetingUrl: "https://zoom.us/meeting/789012",
    participants: [
      { userId: 1, isChair: true, isRequired: true, attendanceMode: "VIRTUAL", initials: "JD", name: "John Doe" },
      {
        userId: 3,
        isChair: false,
        isRequired: true,
        attendanceMode: "VIRTUAL",
        initials: "MJ",
        name: "Michael Johnson",
      },
    ],
    affectedPlanTypes: ["Research Plan", "Quality Plan"],
    notes: "Review funding proposals and research output targets",
    businessGoals: [
      {
        id: 2,
        code: "BG-002",
        description: "Increase research publications by 40%",
        status: "NEW",
        deadline: "2025-12-31",
        ownerId: 1,
        ownerName: "John Doe",
      },
    ],
    actions: [
      {
        id: 3,
        code: "ACT-003",
        description: "Compile research metrics report",
        priority: "HIGH",
        distributionScope: "CONFIDENTIAL",
        scope: "Research Team",
        deadline: "2025-02-15",
        assignedToId: 3,
        assignedToName: "Michael Johnson",
        status: "COMPLETED",
      },
    ],
    concerns: [
      {
        id: 2,
        code: "CON-002",
        description: "Insufficient research funding",
        impact: "May delay project timelines",
        severityRating: "HIGH",
        distributionScope: "CONFIDENTIAL",
        scope: "Leadership",
        status: "ESCALATED",
        raisedById: 1,
        raisedByName: "John Doe",
      },
    ],
    suggestions: [],
    type: "Research",
    mode: "VIRTUAL",
    classification: "CONFIDENTIAL",
    date: "2025-02-20",
    organiser: "John Doe",
    department: "Faculty of Engineering",
    status: "SCHEDULED",
    frequency: "Annual",
    nature: "Strategic Review",
    participantsCount: 2,
  },
  {
    id: 3,
    title: "Quality Assurance Review",
    description: "Q4 quality assurance compliance check",
    meetingType: "Quality Plan",
    meetingMode: "FACE_TO_FACE",
    meetingClassification: "INTERNAL",
    meetingFrequency: "Quarterly",
    committee: "Quality Committee",
    departmentOrCentre: "Operations",
    scheduledAt: "2025-03-10T09:00:00",
    location: "Board Room B",
    meetingUrl: "",
    participants: [
      {
        userId: 2,
        isChair: true,
        isRequired: true,
        attendanceMode: "FACE_TO_FACE",
        initials: "JS",
        name: "Jane Smith",
      },
      {
        userId: 4,
        isChair: false,
        isRequired: true,
        attendanceMode: "FACE_TO_FACE",
        initials: "SL",
        name: "Sarah Lee",
      },
    ],
    affectedPlanTypes: ["Quality Plan", "University Annual Plan"],
    notes: "Review compliance metrics and improvement initiatives",
    businessGoals: [
      {
        id: 3,
        code: "BG-003",
        description: "Achieve 95% quality compliance rate",
        status: "ON_TRACK",
        deadline: "2025-12-31",
        ownerId: 2,
        ownerName: "Jane Smith",
      },
    ],
    actions: [
      {
        id: 4,
        code: "ACT-004",
        description: "Conduct quality audit",
        priority: "CRITICAL",
        distributionScope: "INTERNAL",
        scope: "Operations",
        deadline: "2025-03-05",
        assignedToId: 4,
        assignedToName: "Sarah Lee",
        status: "IN_PROGRESS",
      },
      {
        id: 5,
        code: "ACT-005",
        description: "Update quality documentation",
        priority: "MEDIUM",
        distributionScope: "INTERNAL",
        scope: "Operations",
        deadline: "2025-03-20",
        assignedToId: 2,
        assignedToName: "Jane Smith",
        status: "NEW",
      },
    ],
    concerns: [],
    suggestions: [
      {
        id: 2,
        code: "SUG-002",
        description: "Implement automated compliance monitoring",
        expectedBenefit: "Reduce compliance audit time by 50%",
        distributionScope: "INTERNAL",
        scope: "Operations",
        suggestedById: 4,
        suggestedByName: "Sarah Lee",
      },
    ],
    type: "Quality",
    mode: "FACE_TO_FACE",
    classification: "INTERNAL",
    date: "2025-03-10",
    organiser: "Jane Smith",
    department: "Operations",
    status: "SCHEDULED",
    frequency: "Quarterly",
    nature: "Compliance Review",
    participantsCount: 2,
  },
]

const mockActions: Action[] = [
  {
    id: 1,
    code: "ACT-001",
    description: "Update curriculum documents",
    priority: "HIGH",
    distributionScope: "INTERNAL",
    scope: "Faculty",
    deadline: "2025-02-28",
    assignedToId: 2,
    assignedToName: "Jane Smith",
    status: "IN_PROGRESS",
  },
  {
    id: 2,
    code: "ACT-002",
    description: "Review budget allocation",
    priority: "MEDIUM",
    distributionScope: "CONFIDENTIAL",
    scope: "Leadership",
    deadline: "2025-02-15",
    assignedToId: 1,
    assignedToName: "John Doe",
    status: "NEW",
  },
  {
    id: 3,
    code: "ACT-003",
    description: "Compile research metrics report",
    priority: "HIGH",
    distributionScope: "CONFIDENTIAL",
    scope: "Research Team",
    deadline: "2025-02-15",
    assignedToId: 3,
    assignedToName: "Michael Johnson",
    status: "COMPLETED",
  },
  {
    id: 4,
    code: "ACT-004",
    description: "Conduct quality audit",
    priority: "CRITICAL",
    distributionScope: "INTERNAL",
    scope: "Operations",
    deadline: "2025-03-05",
    assignedToId: 4,
    assignedToName: "Sarah Lee",
    status: "IN_PROGRESS",
  },
  {
    id: 5,
    code: "ACT-005",
    description: "Update quality documentation",
    priority: "MEDIUM",
    distributionScope: "INTERNAL",
    scope: "Operations",
    deadline: "2025-03-20",
    assignedToId: 2,
    assignedToName: "Jane Smith",
    status: "NEW",
  },
]

const mockTranscripts: MeetingTranscript[] = [
  {
    id: 1,
    meetingId: 1,
    filename: "academic-planning-2025-01-15.txt",
    fileType: "TEXT",
    uploadedAt: "2025-01-15T11:30:00",
    uploadedById: 1,
    uploadedByName: "John Doe",
    content: `Academic Planning Meeting - January 15, 2025

Attendees: John Doe (Chair), Jane Smith

Meeting started at 10:00 AM

John Doe: Good morning everyone. Today we need to discuss our goals for the academic year. 
Our main objective is to improve student engagement by 25% and review our curriculum standards.

Jane Smith: I agree. We should also focus on implementing new teaching methodologies. 
I have a suggestion to introduce more interactive online learning platforms to help students.

John Doe: That's a good recommendation. Let's action that - we need someone to research and propose 
specific platforms by end of February. Jane, can you take that action?

Jane Smith: Sure, I'll compile a list of platforms and their features.

John Doe: Now, I have a concern about our budget constraints. We may not have sufficient resources 
for all the initiatives we want to undertake. This is a risk that could limit our new programs.

Jane Smith: We should escalate that concern to the leadership team. They need to know about 
potential budget issues early.

John Doe: Agreed. Let's document this concern and bring it up at the next leadership meeting.
We also need to ensure quality standards are maintained across all programs.

Meeting concluded at 11:00 AM.`,
    summary: "Discussed academic goals, student engagement improvement, teaching methodologies, and budget concerns.",
    extractedData: {
      extractedBusinessGoals: [
        {
          code: "BG-TX-001",
          description: "Improve student engagement by 25%",
          status: "NEW",
          deadline: "2025-06-30",
          ownerId: 1,
          ownerName: "John Doe",
        },
      ],
      extractedActions: [
        {
          code: "ACT-TX-001",
          description: "Research and propose specific online learning platforms",
          priority: "HIGH",
          distributionScope: "INTERNAL",
          scope: "Faculty",
          deadline: "2025-02-28",
          assignedToId: 2,
          assignedToName: "Jane Smith",
          status: "NEW",
        },
      ],
      extractedConcerns: [
        {
          code: "CON-TX-001",
          description: "Budget constraints limiting new initiatives and programs",
          impact: "May prevent implementation of planned improvements",
          severityRating: "HIGH",
          distributionScope: "CONFIDENTIAL",
          scope: "Leadership",
          raisedById: 1,
          raisedByName: "John Doe",
        },
      ],
      extractedSuggestions: [
        {
          code: "SUG-TX-001",
          description: "Introduce interactive online learning platforms",
          expectedBenefit: "Increase student engagement and accessibility",
          distributionScope: "INTERNAL",
          scope: "Faculty",
          suggestedById: 2,
          suggestedByName: "Jane Smith",
        },
      ],
    },
  },
  {
    id: 2,
    meetingId: 2,
    filename: "research-strategy-2025-02-20.mp3",
    fileType: "AUDIO",
    uploadedAt: "2025-02-20T15:45:00",
    uploadedById: 1,
    uploadedByName: "John Doe",
    content: `Research Strategy Review - February 20, 2025

Attendees: John Doe (Chair), Michael Johnson (Virtual)

John Doe: Welcome to the research strategy review. Our goal is to increase research publications 
by 40% over the next year and improve our research impact.

Michael Johnson: That's ambitious. We need to discuss the resources and support we'll need. 
There's also a significant concern - we have insufficient research funding to support all proposals.

John Doe: Yes, that's a critical issue. We need to escalate this to the administration. 
Can you compile a detailed report on funding gaps?

Michael Johnson: I can do that. That would be an action item.

John Doe: Let's also establish clear timelines and milestones for our research initiatives. 
We need to ensure quality standards are maintained in our research output.

Michael Johnson: I suggest we implement a peer review process for all research proposals before funding approval.

John Doe: Excellent suggestion. Let's action that as well. We need to develop guidelines for the review process.

Meeting concluded with action items to be tracked.`,
    summary:
      "Reviewed research strategy, discussed publication targets, funding concerns, and quality assurance processes.",
    extractedData: {
      extractedBusinessGoals: [
        {
          code: "BG-TX-002",
          description: "Increase research publications by 40% over next year",
          status: "NEW",
          deadline: "2025-12-31",
          ownerId: 1,
          ownerName: "John Doe",
        },
        {
          code: "BG-TX-003",
          description: "Improve research impact and citations",
          status: "NEW",
          deadline: "2025-12-31",
          ownerId: 1,
          ownerName: "John Doe",
        },
      ],
      extractedActions: [
        {
          code: "ACT-TX-002",
          description: "Compile detailed report on funding gaps and resource needs",
          priority: "HIGH",
          distributionScope: "CONFIDENTIAL",
          scope: "Research Team",
          deadline: "2025-03-15",
          assignedToId: 3,
          assignedToName: "Michael Johnson",
          status: "NEW",
        },
        {
          code: "ACT-TX-003",
          description: "Develop peer review guidelines for research proposals",
          priority: "MEDIUM",
          distributionScope: "INTERNAL",
          scope: "Research Team",
          deadline: "2025-04-30",
          assignedToId: 3,
          assignedToName: "Michael Johnson",
          status: "NEW",
        },
      ],
      extractedConcerns: [
        {
          code: "CON-TX-002",
          description: "Insufficient research funding to support all proposals",
          impact: "May delay or cancel research initiatives and affect publication targets",
          severityRating: "CRITICAL",
          distributionScope: "CONFIDENTIAL",
          scope: "Leadership",
          raisedById: 3,
          raisedByName: "Michael Johnson",
        },
      ],
      extractedSuggestions: [
        {
          code: "SUG-TX-002",
          description: "Implement formal peer review process for research proposals before funding approval",
          expectedBenefit: "Improve quality of research and ensure proper fund allocation",
          distributionScope: "INTERNAL",
          scope: "Research Team",
          suggestedById: 3,
          suggestedByName: "Michael Johnson",
        },
      ],
    },
  },
]

const mockConcerns: Concern[] = [
  {
    id: 1,
    code: "CON-001",
    description: "Budget constraints for new resources",
    impact: "May limit new initiatives and delay projects",
    severityRating: "MEDIUM",
    distributionScope: "CONFIDENTIAL",
    scope: "Leadership",
    status: "OPEN",
    raisedById: 1,
    raisedByName: "John Doe",
    raisedDate: "2025-01-15",
    linkedMeetingId: 1,
    linkedMeetingTitle: "Academic Planning Meeting",
    linkedActions: [],
    resolutionNotes: null,
    resolvedAt: null,
  },
  {
    id: 2,
    code: "CON-002",
    description: "Insufficient research funding",
    impact: "May delay project timelines and reduce research output",
    severityRating: "HIGH",
    distributionScope: "CONFIDENTIAL",
    scope: "Leadership",
    status: "ESCALATED",
    raisedById: 1,
    raisedByName: "John Doe",
    raisedDate: "2025-02-20",
    linkedMeetingId: 2,
    linkedMeetingTitle: "Research Strategy Review",
    linkedActions: [3],
    resolutionNotes: "Escalated to CFO for budget review and approval",
    resolvedAt: null,
  },
  {
    id: 3,
    code: "CON-003",
    description: "Staff shortage in IT department",
    impact: "Delays in system maintenance and support",
    severityRating: "MEDIUM",
    distributionScope: "INTERNAL",
    scope: "Operations",
    status: "OPEN",
    raisedById: 2,
    raisedByName: "Jane Smith",
    raisedDate: "2025-01-20",
    linkedMeetingId: 3,
    linkedMeetingTitle: "Quality Assurance Review",
    linkedActions: [],
    resolutionNotes: null,
    resolvedAt: null,
  },
  {
    id: 4,
    code: "CON-004",
    description: "Compliance gaps in data management systems",
    impact: "Risk of regulatory violations and data security breaches",
    severityRating: "CRITICAL",
    distributionScope: "CONFIDENTIAL",
    scope: "Leadership",
    status: "ESCALATED",
    raisedById: 1,
    raisedByName: "John Doe",
    raisedDate: "2025-02-10",
    linkedMeetingId: 3,
    linkedMeetingTitle: "Quality Assurance Review",
    linkedActions: [4, 5],
    resolutionNotes: "Assigned to compliance officer for immediate review",
    resolvedAt: null,
  },
  {
    id: 5,
    code: "CON-005",
    description: "Outdated learning management system",
    impact: "Limited functionality affecting student learning experience",
    severityRating: "LOW",
    distributionScope: "INTERNAL",
    scope: "Faculty",
    status: "RESOLVED",
    raisedById: 2,
    raisedByName: "Jane Smith",
    raisedDate: "2024-12-15",
    linkedMeetingId: 1,
    linkedMeetingTitle: "Academic Planning Meeting",
    linkedActions: [2],
    resolutionNotes: "New LMS implementation planned for Q3 2025",
    resolvedAt: "2025-02-15",
  },
  {
    id: 6,
    code: "CON-006",
    description: "Inadequate student support services",
    impact: "May affect student retention and satisfaction",
    severityRating: "HIGH",
    distributionScope: "INTERNAL",
    scope: "Faculty",
    status: "IN_PROGRESS",
    raisedById: 3,
    raisedByName: "Michael Johnson",
    raisedDate: "2025-01-25",
    linkedMeetingId: 1,
    linkedMeetingTitle: "Academic Planning Meeting",
    linkedActions: [6],
    resolutionNotes: "Working on expansion of counseling and support services",
    resolvedAt: null,
  },
  {
    id: 7,
    code: "CON-007",
    description: "Limited diversity in research team composition",
    impact: "Reduced perspective diversity in research outputs",
    severityRating: "MEDIUM",
    distributionScope: "INTERNAL",
    scope: "Research Team",
    status: "OPEN",
    raisedById: 3,
    raisedByName: "Michael Johnson",
    raisedDate: "2025-02-18",
    linkedMeetingId: 2,
    linkedMeetingTitle: "Research Strategy Review",
    linkedActions: [],
    resolutionNotes: null,
    resolvedAt: null,
  },
]

export function useMeetings() {
  const [meetings, setMeetings] = useState<Meeting[]>(mockMeetings)
  const [actions, setActions] = useState<Action[]>(mockActions)
  const [transcripts, setTranscripts] = useState<MeetingTranscript[]>(mockTranscripts)
  const [concerns, setConcerns] = useState<Concern[]>(mockConcerns)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addMeeting = useCallback(
    (meetingData: Omit<Meeting, "id">) => {
      const newMeeting: Meeting = {
        ...meetingData,
        id: Math.max(...meetings.map((m) => m.id), 0) + 1,
      }
      setMeetings([...meetings, newMeeting])
      return newMeeting
    },
    [meetings],
  )

  const updateMeeting = useCallback(
    (id: number, updates: Partial<Meeting>) => {
      setMeetings(meetings.map((m) => (m.id === id ? { ...m, ...updates } : m)))
    },
    [meetings],
  )

  const deleteMeeting = useCallback(
    (id: number) => {
      setMeetings(meetings.filter((m) => m.id !== id))
    },
    [meetings],
  )

  const addAttendeeToMeeting = useCallback(
    (meetingId: number, participant: Participant) => {
      updateMeeting(meetingId, (meeting) => {
        return {
          ...meeting,
          participants: [...(meeting.participants || []), participant],
          participantsCount: (meeting.participants?.length || 0) + 1,
        }
      })
    },
    [updateMeeting],
  )

  const removeAttendeeFromMeeting = useCallback(
    (meetingId: number, userId: number) => {
      updateMeeting(meetingId, (meeting) => {
        const updatedParticipants = (meeting.participants || []).filter((p) => p.userId !== userId)
        return {
          ...meeting,
          participants: updatedParticipants,
          participantsCount: updatedParticipants.length,
        }
      })
    },
    [updateMeeting],
  )

  const addBusinessGoalToMeeting = useCallback(
    (meetingId: number, goal: BusinessGoal) => {
      updateMeeting(meetingId, (meeting) => ({
        ...meeting,
        businessGoals: [...(meeting.businessGoals || []), goal],
      }))
    },
    [updateMeeting],
  )

  const updateBusinessGoal = useCallback(
    (meetingId: number, goalId: number, updates: Partial<BusinessGoal>) => {
      updateMeeting(meetingId, (meeting) => ({
        ...meeting,
        businessGoals: (meeting.businessGoals || []).map((g) => (g.id === goalId ? { ...g, ...updates } : g)),
      }))
    },
    [updateMeeting],
  )

  const deleteBusinessGoal = useCallback(
    (meetingId: number, goalId: number) => {
      updateMeeting(meetingId, (meeting) => ({
        ...meeting,
        businessGoals: (meeting.businessGoals || []).filter((g) => g.id !== goalId),
      }))
    },
    [updateMeeting],
  )

  const assignBusinessGoal = useCallback(
    (meetingId: number, goalId: number, ownerId: number, ownerName: string) => {
      updateBusinessGoal(meetingId, goalId, { ownerId, ownerName })
    },
    [updateBusinessGoal],
  )

  const addActionToMeeting = useCallback(
    (meetingId: number, action: Action) => {
      updateMeeting(meetingId, (meeting) => ({
        ...meeting,
        actions: [...(meeting.actions || []), action],
      }))
    },
    [updateMeeting],
  )

  const updateActionInMeeting = useCallback(
    (meetingId: number, actionId: number, updates: Partial<Action>) => {
      updateMeeting(meetingId, (meeting) => ({
        ...meeting,
        actions: (meeting.actions || []).map((a) => (a.id === actionId ? { ...a, ...updates } : a)),
      }))
    },
    [updateMeeting],
  )

  const deleteActionInMeeting = useCallback(
    (meetingId: number, actionId: number) => {
      updateMeeting(meetingId, (meeting) => ({
        ...meeting,
        actions: (meeting.actions || []).filter((a) => a.id !== actionId),
      }))
    },
    [updateMeeting],
  )

  const assignAction = useCallback(
    (meetingId: number, actionId: number, assignedToId: number, assignedToName: string) => {
      updateActionInMeeting(meetingId, actionId, { assignedToId, assignedToName })
    },
    [updateActionInMeeting],
  )

  const updateActionStatus = useCallback(
    (meetingId: number, actionId: number, status: Action["status"]) => {
      updateActionInMeeting(meetingId, actionId, { status })
    },
    [updateActionInMeeting],
  )

  const markActionAsComplete = useCallback(
    (meetingId: number, actionId: number, proofText?: string) => {
      updateActionInMeeting(meetingId, actionId, {
        status: "COMPLETED",
        notes: proofText ? `Proof: ${proofText}` : undefined,
      })
      setActions((prevActions) =>
        prevActions.map((a) =>
          a.id === actionId ? { ...a, status: "COMPLETED", notes: proofText ? `Proof: ${proofText}` : undefined } : a,
        ),
      )
    },
    [updateActionInMeeting],
  )

  const addConcernToMeeting = useCallback(
    (meetingId: number, concern: Concern) => {
      updateMeeting(meetingId, (meeting) => ({
        ...meeting,
        concerns: [...(meeting.concerns || []), concern],
      }))
    },
    [updateMeeting],
  )

  const updateConcern = useCallback(
    (meetingId: number, concernId: number, updates: Partial<Concern>) => {
      updateMeeting(meetingId, (meeting) => ({
        ...meeting,
        concerns: (meeting.concerns || []).map((c) => (c.id === concernId ? { ...c, ...updates } : c)),
      }))
    },
    [updateMeeting],
  )

  const deleteConcern = useCallback(
    (meetingId: number, concernId: number) => {
      updateMeeting(meetingId, (meeting) => ({
        ...meeting,
        concerns: (meeting.concerns || []).filter((c) => c.id !== concernId),
      }))
    },
    [updateMeeting],
  )

  const escalateConcern = useCallback(
    (meetingId: number, concernId: number, newSeverity: Concern["severityRating"]) => {
      updateConcern(meetingId, concernId, { severityRating: newSeverity })
    },
    [updateConcern],
  )

  const linkActionsToConcern = useCallback(
    (meetingId: number, concernId: number, actionIds: number[]) => {
      updateConcern(meetingId, concernId, { relatedActionIds: actionIds })
    },
    [updateConcern],
  )

  const addSuggestionToMeeting = useCallback(
    (meetingId: number, suggestion: Suggestion) => {
      updateMeeting(meetingId, (meeting) => ({
        ...meeting,
        suggestions: [...(meeting.suggestions || []), suggestion],
      }))
    },
    [updateMeeting],
  )

  const updateSuggestion = useCallback(
    (meetingId: number, suggestionId: number, updates: Partial<Suggestion>) => {
      updateMeeting(meetingId, (meeting) => ({
        ...meeting,
        suggestions: (meeting.suggestions || []).map((s) => (s.id === suggestionId ? { ...s, ...updates } : s)),
      }))
    },
    [updateMeeting],
  )

  const deleteSuggestion = useCallback(
    (meetingId: number, suggestionId: number) => {
      updateMeeting(meetingId, (meeting) => ({
        ...meeting,
        suggestions: (meeting.suggestions || []).filter((s) => s.id !== suggestionId),
      }))
    },
    [updateMeeting],
  )

  const rejectSuggestion = useCallback(
    (meetingId: number, suggestionId: number) => {
      updateSuggestion(meetingId, suggestionId, {
        implementationNotes: "Rejected",
      })
    },
    [updateSuggestion],
  )

  const implementSuggestion = useCallback(
    (meetingId: number, suggestionId: number, notes?: string) => {
      updateSuggestion(meetingId, suggestionId, {
        implementationNotes: notes || "Implementation in progress",
      })
    },
    [updateSuggestion],
  )

  const addTranscriptToMeeting = useCallback(
    (meetingId: number, transcript: MeetingTranscript) => {
      updateMeeting(meetingId, (meeting) => ({
        ...meeting,
        transcript,
      }))

      // Auto-analyze transcript content
      const analyzed = analyzeTranscript(transcript.content)
      if (analyzed.goals.length > 0) {
        analyzed.goals.forEach((goal) => addBusinessGoalToMeeting(meetingId, goal))
      }
      if (analyzed.actions.length > 0) {
        analyzed.actions.forEach((action) => addActionToMeeting(meetingId, action))
      }
      if (analyzed.concerns.length > 0) {
        analyzed.concerns.forEach((concern) => addConcernToMeeting(meetingId, concern))
      }
      if (analyzed.suggestions.length > 0) {
        analyzed.suggestions.forEach((suggestion) => addSuggestionToMeeting(meetingId, suggestion))
      }
    },
    [updateMeeting, addBusinessGoalToMeeting, addActionToMeeting, addConcernToMeeting, addSuggestionToMeeting],
  )

  const getTranscriptByMeeting = useCallback(
    (meetingId: number) => {
      return transcripts.find((t) => t.meetingId === meetingId) || null
    },
    [transcripts],
  )

  const getSuggestionsByUser = useCallback(
    (userId: number) => {
      const suggestions: Suggestion[] = []
      meetings.forEach((meeting) => {
        meeting.suggestions?.forEach((suggestion) => {
          if (suggestion.suggestedById === userId) {
            suggestions.push(suggestion)
          }
        })
      })
      return suggestions
    },
    [meetings],
  )

  const analyzeTranscript = (
    transcriptContent: string,
  ): {
    goals: BusinessGoal[]
    actions: Action[]
    concerns: Concern[]
    suggestions: Suggestion[]
  } => {
    const goals: BusinessGoal[] = []
    const actions: Action[] = []
    const concerns: Concern[] = []
    const suggestions: Suggestion[] = []

    // Simple keyword-based extraction (can be enhanced with actual NLP)
    const lines = transcriptContent.split("\n")
    let goalCount = 1
    let actionCount = 1
    let concernCount = 1
    let suggestionCount = 1

    for (const line of lines) {
      const lowerLine = line.toLowerCase()

      // Extract goals
      if (lowerLine.includes("goal") || lowerLine.includes("objective") || lowerLine.includes("target")) {
        goals.push({
          code: `BG-${String(goalCount).padStart(3, "0")}`,
          description: line.trim(),
          status: "NEW",
          deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          ownerId: 1,
          ownerName: "System",
        })
        goalCount++
      }

      // Extract actions
      if (
        lowerLine.includes("action") ||
        lowerLine.includes("todo") ||
        lowerLine.includes("task") ||
        lowerLine.includes("do")
      ) {
        actions.push({
          code: `ACT-${String(actionCount).padStart(3, "0")}`,
          description: line.trim(),
          priority: "MEDIUM",
          distributionScope: "INTERNAL",
          scope: "Team",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          assignedToId: 1,
          assignedToName: "Pending Assignment",
          status: "NEW",
        })
        actionCount++
      }

      // Extract concerns
      if (
        lowerLine.includes("concern") ||
        lowerLine.includes("risk") ||
        lowerLine.includes("issue") ||
        lowerLine.includes("problem")
      ) {
        concerns.push({
          code: `CON-${String(concernCount).padStart(3, "0")}`,
          description: line.trim(),
          impact: "Needs assessment",
          severityRating: "MEDIUM",
          distributionScope: "INTERNAL",
          scope: "Team",
          raisedById: 1,
          raisedByName: "System",
        })
        concernCount++
      }

      // Extract suggestions
      if (lowerLine.includes("suggest") || lowerLine.includes("recommend") || lowerLine.includes("improve")) {
        suggestions.push({
          code: `SUG-${String(suggestionCount).padStart(3, "0")}`,
          description: line.trim(),
          expectedBenefit: "To be assessed",
          distributionScope: "INTERNAL",
          scope: "Team",
          suggestedById: 1,
          suggestedByName: "System",
        })
        suggestionCount++
      }
    }

    return { goals, actions, concerns, suggestions }
  }

  return {
    meetings,
    addMeeting,
    updateMeeting,
    deleteMeeting,
    addAttendeeToMeeting,
    removeAttendeeFromMeeting,
    addBusinessGoalToMeeting,
    updateBusinessGoal,
    deleteBusinessGoal,
    assignBusinessGoal,
    addActionToMeeting,
    updateActionInMeeting,
    deleteActionInMeeting,
    markActionAsComplete,
    assignAction,
    updateActionStatus,
    addConcernToMeeting,
    updateConcern,
    deleteConcern,
    escalateConcern,
    linkActionsToConcern,
    addSuggestionToMeeting,
    updateSuggestion,
    deleteSuggestion,
    rejectSuggestion,
    implementSuggestion,
    getSuggestionsByUser,
    addTranscriptToMeeting,
    getTranscriptByMeeting,
    isLoading,
    error,
    concerns,
    getConcerns: () => concerns,
  }
}

export function useActions() {
  const [actions, setActions] = useState<Action[]>(mockActions)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)



  const addAction = useCallback(
    (meetingId: number, actionData: Omit<Action, "id">) => {
      const newAction: Action = {
        ...actionData,
        id: Math.max(...actions.map((a) => a.id || 0), 0) + 1,
      }
      setActions([...actions, newAction])
      return newAction
    },
    [actions],
  )

  const updateAction = useCallback(
    (id: number, updates: Partial<Action>) => {
      setActions(actions.map((a) => (a.id === id ? { ...a, ...updates } : a)))
    },
    [actions],
  )

  const deleteAction = useCallback(
    (id: number) => {
      setActions(actions.filter((a) => a.id !== id))
    },
    [actions],
  )

  return { actions, addAction, updateAction, deleteAction, isLoading, error }
}
