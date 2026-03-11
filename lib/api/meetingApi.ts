// --------------------
// LIST MEETINGS (PAGINATED)

import { ApiResponse, PageResponse } from "@/types/api"
import api from "../store/api/baseQuery"
import { CreateMeetingRequest, MeetingDetailResponse, MeetingResponse, UpdateMeetingRequest } from "../store/meeting/meetingType"


// --------------------
export const listMeetings = async (
    organizationId: number,
    page = 0,
    size = 10
): Promise<PageResponse<MeetingResponse>> => {
    const response = await api.get<ApiResponse<PageResponse<MeetingResponse>>>(
        "/api/meetings",
        {
            params: { organizationId, page, size },
        }
    )

    return response.data.data
}

// --------------------
// GET SINGLE MEETING
// --------------------
export const getMeetingById = async (
    id: number
): Promise<MeetingDetailResponse> => {
    const response = await api.get<ApiResponse<MeetingDetailResponse>>(
        `/api/meetings/${id}`
    )

    return response.data.data
}

// --------------------
// CREATE
// --------------------
export const createMeeting = async (
    payload: CreateMeetingRequest
): Promise<MeetingResponse> => {
    const response = await api.post<ApiResponse<MeetingResponse>>(
        "/api/meetings",
        payload
    )

    return response.data.data
}

// --------------------
// UPDATE
// --------------------
export const updateMeeting = async (
    id: number,
    payload: UpdateMeetingRequest
): Promise<MeetingResponse> => {
    const response = await api.put<ApiResponse<MeetingResponse>>(
        `/api/meetings/${id}`,
        payload
    )

    return response.data.data
}

// --------------------
// DELETE
// --------------------
export const deleteMeeting = async (id: number): Promise<void> => {
    await api.delete(`/api/meetings/${id}`)
}

// --------------------
// UPCOMING
// --------------------
export const getUpcomingMeetings = async (
    organizationId: number
): Promise<MeetingResponse[]> => {
    const response = await api.get<ApiResponse<MeetingResponse[]>>(
        "/api/meetings/upcoming",
        { params: { organizationId } }
    )

    return response.data.data
}

// --------------------
// ADD PARTICIPANTS
// --------------------
export const addParticipants = async (
    meetingId: number,
    userIds: number[]
) => {
    await api.post(`/api/meetings/${meetingId}/participants`, userIds)
}

// --------------------
// GET ACTIONS
// --------------------
export const getMeetingActions = async (meetingId: number) => {
    const response = await api.get(`/api/meetings/${meetingId}/actions`)
    return response.data.data
}

// --------------------
// ADD ACTION
// --------------------
export const addActionItem = async (
    meetingId: number,
    payload: any
) => {
    const response = await api.post(
        `/api/meetings/${meetingId}/actions`,
        payload
    )

    return response.data.data
}