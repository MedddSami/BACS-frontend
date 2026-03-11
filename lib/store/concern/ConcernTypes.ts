// concern.types.ts

export enum PriorityLevel {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW",
}

export interface UserResponse {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

export interface Concern {
    id: number;
    description: string;
    impact?: string;
    severity: PriorityLevel;
    isResolved: boolean;
    resolution?: string;
    meetingId: number;
    raisedBy: UserResponse;
    createdAt: string;
}

export interface CreateConcernRequest {
    code: string;
    description: string;
    meetingId: number;
    impact?: string;
    severity?: PriorityLevel;
    raisedById?: number;
}

export interface UpdateConcernRequest {
    description?: string;
    impact?: string;
    severityRating?: string;        // since DTO differs
    distributionScope?: string;
    scope?: string;
    isResolved?: boolean;
    resolution?: string;
    relatedActionIds?: number[];
}

export interface ResolveConcernRequest {
    resolution: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    timestamp: string;
}