import { ApiResponse, CreateSuggestionRequest, ImplementSuggestionRequest, PageResponse, RejectSuggestionRequest, Suggestion, UpdateSuggestionRequest } from "../store/suggestion/suggestionTypes";
import api from "../store/api/baseQuery";


const BASE = "/api/suggestions";

export const suggestionApi = {

  create: async (payload: CreateSuggestionRequest) => {
    const res = await api.post<ApiResponse<Suggestion>>(BASE, payload);
    return res.data.data;
  },

  getById: async (id: number) => {
    const res = await api.get<ApiResponse<Suggestion>>(`${BASE}/${id}`);
    return res.data.data;
  },

  update: async (id: number, payload: UpdateSuggestionRequest) => {
    const res = await api.put<ApiResponse<Suggestion>>(`${BASE}/${id}`, payload);
    return res.data.data;
  },

  delete: async (id: number) => {
    await api.delete<ApiResponse<void>>(`${BASE}/${id}`);
    return id;
  },

  getByMeeting: async (meetingId: number) => {
    const res = await api.get<ApiResponse<Suggestion[]>>(
      `${BASE}/meeting/${meetingId}`
    );
    return res.data.data;
  },

  getPending: async () => {
    const res = await api.get<ApiResponse<Suggestion[]>>(`${BASE}/pending`);
    return res.data.data;
  },

  getImplemented: async () => {
    const res = await api.get<ApiResponse<Suggestion[]>>(`${BASE}/implemented`);
    return res.data.data;
  },

  getByUser: async (
    userId: number,
    page = 0,
    size = 10
  ) => {
    const res = await api.get<ApiResponse<PageResponse<Suggestion>>>(
      `${BASE}/user/${userId}?page=${page}&size=${size}`
    );
    return res.data.data;
  },

  implement: async (
    id: number,
    payload: ImplementSuggestionRequest
  ) => {
    const res = await api.patch<ApiResponse<Suggestion>>(
      `${BASE}/${id}/implement`,
      payload
    );
    return res.data.data;
  },

  reject: async (
    id: number,
    payload: RejectSuggestionRequest
  ) => {
    const res = await api.patch<ApiResponse<Suggestion>>(
      `${BASE}/${id}/reject`,
      payload
    );
    return res.data.data;
  },

  linkActions: async (id: number, actionIds: number[]) => {
    await api.post<ApiResponse<void>>(
      `${BASE}/${id}/actions`,
      actionIds
    );
    return id;
  },
};