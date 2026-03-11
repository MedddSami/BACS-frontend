// suggestion.types.ts

export interface UserResponse {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

export interface Suggestion {
    id: number;
    description: string;
    expectedBenefit?: string;
    isImplemented: boolean;
    implementationNotes?: string;
    meetingId: number;
    suggestedBy: UserResponse;
    createdAt: string;
}

export interface CreateSuggestionRequest {
    code: string;
    description: string;
    meetingId: number;
    expectedBenefit?: string;
    suggestedById?: number;
}

export interface UpdateSuggestionRequest {
    description?: string;
    expectedBenefit?: string;
    distributionScope?: string;
    scope?: string;
    isImplemented?: boolean;
    implementationNotes?: string;
    relatedActionIds?: number[];
    relatedPlanIds?: number[];
}

export interface ImplementSuggestionRequest {
    implementationNotes: string;
}

export interface RejectSuggestionRequest {
    rejectionReason: string;
}

/* ===== Spring Page<T> Mapping ===== */
export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    timestamp: string;
}