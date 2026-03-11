/* ───────────────────────────── */
/* Get My Actions */
/* ───────────────────────────── */

import { ApiResponse, PageResponse } from "@/types/api"
import { ActionItemResponse, ActionStatus } from "../store/actionItem/actionItemType"
import api from "../store/api/baseQuery"

export const actionApi = {
    getMyActions: async (
        page = 0,
        size = 10
    ): Promise<PageResponse<ActionItemResponse>> => {
        const res = await api.get<
            ApiResponse<PageResponse<ActionItemResponse>>
        >(`/api/actions/my?page=${page}&size=${size}`)

        return res.data.data
    },

    getMyActionsByStatus: async (
        status: ActionStatus,
        page = 0,
        size = 10
    ): Promise<PageResponse<ActionItemResponse>> => {
        const res = await api.get<
            ApiResponse<PageResponse<ActionItemResponse>>
        >(`/api/actions/my/status/${status}?page=${page}&size=${size}`)

        return res.data.data
    },

    getOverdueActions: async (): Promise<ActionItemResponse[]> => {
        const res = await api.get<
            ApiResponse<ActionItemResponse[]>
        >(`/api/actions/my/overdue`)

        return res.data.data
    },

    getActionById: async (
        id: number
    ): Promise<ActionItemResponse> => {
        const res = await api.get<
            ApiResponse<ActionItemResponse>
        >(`/api/actions/${id}`)

        return res.data.data
    },

    updateAction: async (
        id: number,
        payload: any
    ): Promise<ActionItemResponse> => {
        const res = await api.put<
            ApiResponse<ActionItemResponse>
        >(`/api/actions/${id}`, payload)

        return res.data.data
    },

    updateStatus: async (
        id: number,
        status: ActionStatus
    ): Promise<ActionItemResponse> => {
        const res = await api.patch<
            ApiResponse<ActionItemResponse>
        >(`/api/actions/${id}/status?status=${status}`)

        return res.data.data
    },

    assignAction: async (
        id: number,
        assigneeId: number
    ): Promise<ActionItemResponse> => {
        const res = await api.patch<
            ApiResponse<ActionItemResponse>
        >(`/api/actions/${id}/assign?assigneeId=${assigneeId}`)

        return res.data.data
    },

    deleteAction: async (id: number): Promise<void> => {
        await api.delete(`/api/actions/${id}`)
    },
}