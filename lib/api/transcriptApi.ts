import api from "../store/api/baseQuery";
import { TranscriptResponse, UploadTranscriptRequest } from "../store/transcript/transcriptTypes";

export const transcriptApi = {
  uploadAudio: async (meetingId: number, file: File): Promise<TranscriptResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("meetingId", meetingId.toString());

    const res = await api.post("/api/transcripts/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },

  uploadTranscript: async (payload: UploadTranscriptRequest): Promise<TranscriptResponse> => {
    const res = await api.post("/api/transcripts", payload);
    return res.data.data;
  },

  getByMeeting: async (meetingId: number): Promise<TranscriptResponse> => {
    const res = await api.get(`/api/transcripts/meeting/${meetingId}`);
    return res.data.data;
  },

  processTranscript: async (id: number): Promise<TranscriptResponse> => {
    const res = await api.post(`/api/transcripts/${id}/process`);
    return res.data.data;
  },

  generateSummary: async (id: number): Promise<string> => {
    const res = await api.post(`/api/transcripts/${id}/summarize`);
    return res.data.data;
  },
};