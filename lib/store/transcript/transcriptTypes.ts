export enum TranscriptStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
}

export interface TranscriptResponse {
    id: number;
    meetingId: number;
    audioFileUrl?: string;
    transcriptText?: string;
    summary?: string;
    status: TranscriptStatus;
    processedAt?: string;
    processingDurationSeconds?: number;
}

export interface UploadTranscriptRequest {
    meetingId: number;
    audioFileUrl?: string;
    transcriptText?: string;
}