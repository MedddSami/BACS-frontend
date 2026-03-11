// businessGoal.types.ts

export enum BusinessGoalStatus {
    NEW = "NEW",
    ON_TRACK = "ON_TRACK",
    AT_RISK = "AT_RISK",
    ISSUE = "ISSUE",
    BLOCKED = "BLOCKED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}

export interface UserResponse {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

export interface BusinessGoal {
    id: number;
    code: string;
    description: string;
    status: BusinessGoalStatus;
    deadline?: string; // LocalDate -> string (ISO)
    timeAllocated?: number;
    notes?: string;
    meetingId: number;
    meetingTitle: string;
    owner: UserResponse;
    relatedActionsCount: number;
    relatedConcernsCount: number;
    relatedSuggestionsCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBusinessGoalRequest {
    code: string;
    description: string;
    meetingId: number;
    ownerId: number;
    status?: BusinessGoalStatus;
    deadline?: string;
    timeAllocated?: number;
    notes?: string;
}

export interface UpdateBusinessGoalRequest {
    description?: string;
    status?: BusinessGoalStatus;
    deadline?: string;
    timeAllocated?: number;
    notes?: string;
    ownerId?: number;
}

/** Spring Page<T> */
export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    timestamp: string;
}