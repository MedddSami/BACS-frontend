// businessGoal.api.ts

import { ApiResponse, PageResponse } from "@/types/api";
import { BusinessGoal, BusinessGoalStatus, CreateBusinessGoalRequest, UpdateBusinessGoalRequest } from "../store/businessGoal/businessGoalTypes";
import api from "../store/api/baseQuery";


const BASE = "/api/business-goals";

export const businessGoalApi = {
  create: async (payload: CreateBusinessGoalRequest) => {
    const res = await api.post<ApiResponse<BusinessGoal>>(BASE, payload);
    return res.data.data;
  },

  getById: async (id: number) => {
    const res = await api.get<ApiResponse<BusinessGoal>>(`${BASE}/${id}`);
    return res.data.data;
  },

  update: async (id: number, payload: UpdateBusinessGoalRequest) => {
    const res = await api.put<ApiResponse<BusinessGoal>>(
      `${BASE}/${id}`,
      payload
    );
    return res.data.data;
  },

  delete: async (id: number) => {
    await api.delete<ApiResponse<void>>(`${BASE}/${id}`);
    return id;
  },

  getByMeeting: async (meetingId: number) => {
    const res = await api.get<ApiResponse<BusinessGoal[]>>(
      `${BASE}/meeting/${meetingId}`
    );
    return res.data.data;
  },

  getByOwner: async (ownerId: number, page = 0, size = 10) => {
    const res = await api.get<ApiResponse<PageResponse<BusinessGoal>>>(
      `${BASE}/owner/${ownerId}?page=${page}&size=${size}`
    );
    return res.data.data;
  },

  getByStatus: async (status: BusinessGoalStatus) => {
    const res = await api.get<ApiResponse<BusinessGoal[]>>(
      `${BASE}/status/${status}`
    );
    return res.data.data;
  },

  getOverdue: async () => {
    const res = await api.get<ApiResponse<BusinessGoal[]>>(
      `${BASE}/overdue`
    );
    return res.data.data;
  },

  getActiveByOrganization: async (organizationId: number) => {
    const res = await api.get<ApiResponse<BusinessGoal[]>>(
      `${BASE}/organization/${organizationId}/active`
    );
    return res.data.data;
  },

  updateStatus: async (id: number, status: BusinessGoalStatus) => {
    const res = await api.patch<ApiResponse<BusinessGoal>>(
      `${BASE}/${id}/status?status=${status}`
    );
    return res.data.data;
  },

  assignOwner: async (id: number, ownerId: number) => {
    await api.patch<ApiResponse<void>>(
      `${BASE}/${id}/assign?ownerId=${ownerId}`
    );
    return { id, ownerId };
  },
};