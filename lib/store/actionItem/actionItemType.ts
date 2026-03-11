export type ActionStatus =
    | "NEW"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "ON_HOLD"

export interface ActionItemResponse {
    id: number
    title: string
    description?: string
    status: ActionStatus
    priority: string
    deadline?: string
    assignedToId?: number
    assignedToName?: string
    meetingId?: number
    createdAt: string
    updatedAt?: string
}
