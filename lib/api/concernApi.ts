import api from "../store/api/baseQuery";
import { ApiResponse, Concern, CreateConcernRequest, PriorityLevel, ResolveConcernRequest, UpdateConcernRequest } from "../store/concern/ConcernTypes";


const BASE = "/api/concerns";

export const concernApi = {
    create: async (payload: CreateConcernRequest) => {
        const res = await api.post < ApiResponse< Concern >> (BASE, payload);
        return res.data.data;
    },

    getById: async (id: number) => {
        const res = await api.get<ApiResponse<Concern>>(`${BASE}/${id}`);
        return res.data.data;
    },

    update: async (id: number, payload: UpdateConcernRequest) => {
        const res = await api.put<ApiResponse<Concern>>(`${BASE}/${id}`, payload);
        return res.data.data;
    },

    delete: async (id: number) => {
        await api.delete<ApiResponse<void>>(`${BASE}/${id}`);
        return id;
    },

    getByMeeting: async (meetingId: number) => {
        const res = await api.get<ApiResponse<Concern[]>>(
            `${BASE}/meeting/${meetingId}`
        );
        return res.data.data;
    },

    getUnresolved: async () => {
        const res = await api.get<ApiResponse<Concern[]>>(`${BASE}/unresolved`);
        return res.data.data;
    },

    getUnresolvedByOrganization: async (organizationId: number) => {
        const res = await api.get<ApiResponse<Concern[]>>(
            `${BASE}/organization/${organizationId}/unresolved`
        );
        return res.data.data;
    },

    getBySeverity: async (severity: PriorityLevel) => {
        const res = await api.get<ApiResponse<Concern[]>>(
            `${BASE}/severity/${severity}`
        );
        return res.data.data;
    },

    resolve: async (id: number, payload: ResolveConcernRequest) => {
        const res = await api.patch<ApiResponse<Concern>>(
            `${BASE}/${id}/resolve`,
            payload
        );
        return res.data.data;
    },

    escalate: async (id: number, recipientIds: number[]) => {
        await api.post<ApiResponse<void>>(
            `${BASE}/${id}/escalate`,
            recipientIds
        );
        return id;
    },

    linkActions: async (id: number, actionIds: number[]) => {
        await api.post<ApiResponse<void>>(
            `${BASE}/${id}/actions`,
            actionIds
        );
        return id;
    },
};