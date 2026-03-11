import { RootState } from "..";

export const selectTranscript = (state: RootState) => state.transcripts.transcript;
export const selectTranscriptLoading = (state: RootState) => state.transcripts.loading;
export const selectTranscriptActionLoading = (state: RootState) => state.transcripts.actionLoading;
export const selectTranscriptSummary = (state: RootState) => state.transcripts.summary;
export const selectTranscriptError = (state: RootState) => state.transcripts.error;