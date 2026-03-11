import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { CreateMeetingRequest, MeetingDetailResponse, MeetingResponse, UpdateMeetingRequest } from "./meetingType"
import { addParticipants, createMeeting, deleteMeeting, getMeetingById, getUpcomingMeetings, listMeetings, updateMeeting } from "@/lib/api/meetingApi"


interface MeetingsState {
    meetings: MeetingResponse[]
    upcomingMeetings: MeetingResponse[]
    selectedMeeting: MeetingDetailResponse | null

    page: number
    size: number
    totalPages: number
    totalElements: number

    loading: boolean
    actionLoading: boolean   // for create/update/delete
    error: string | null
}

const initialState: MeetingsState = {
    meetings: [],
    upcomingMeetings: [],
    selectedMeeting: null,

    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,

    loading: false,
    actionLoading: false,
    error: null,
}

export const fetchMeetings = createAsyncThunk(
    "meetings/fetchMeetings",
    async (
        {
            organizationId,
            page = 0,
            size = 10,
        }: { organizationId: number; page?: number; size?: number },
        { rejectWithValue }
    ) => {
        try {
            return await listMeetings(organizationId, page, size)
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to fetch meetings"
            )
        }
    }
)

export const fetchMeetingDetail = createAsyncThunk(
    "meetings/fetchMeetingDetail",
    async (id: number, { rejectWithValue }) => {
        try {
            return await getMeetingById(id)
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to fetch meeting"
            )
        }
    }
)

export const createMeetingThunk = createAsyncThunk(
    "meetings/createMeeting",
    async (payload: CreateMeetingRequest, { rejectWithValue }) => {
        try {
            return await createMeeting(payload)
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to create meeting"
            )
        }
    }
)

export const updateMeetingThunk = createAsyncThunk(
    "meetings/updateMeeting",
    async (
        { id, payload }: { id: number; payload: UpdateMeetingRequest },
        { rejectWithValue }
    ) => {
        try {
            return await updateMeeting(id, payload)
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to update meeting"
            )
        }
    }
)

export const deleteMeetingThunk = createAsyncThunk(
    "meetings/deleteMeeting",
    async (id: number, { rejectWithValue }) => {
        try {
            await deleteMeeting(id)
            return id
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to delete meeting"
            )
        }
    }
)

export const fetchUpcomingMeetings = createAsyncThunk(
    "meetings/fetchUpcoming",
    async (organizationId: number, { rejectWithValue }) => {
        try {
            return await getUpcomingMeetings(organizationId)
        } catch (err: any) {
            return rejectWithValue("Failed to fetch upcoming meetings")
        }
    }
)

export const addParticipantsThunk = createAsyncThunk(
    "meetings/addParticipants",
    async (
        { meetingId, userIds }: { meetingId: number; userIds: number[] },
        { rejectWithValue }
    ) => {
        try {
            await addParticipants(meetingId, userIds)
            return { meetingId, userIds }
        } catch (err: any) {
            return rejectWithValue("Failed to add participants")
        }
    }
)

const meetingsSlice = createSlice({
    name: "meetings",
    initialState,
    reducers: {
        clearSelectedMeeting: (state) => {
            state.selectedMeeting = null
        },
    },
    extraReducers: (builder) => {
        builder

            // ================= FETCH MEETINGS =================
            .addCase(fetchMeetings.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchMeetings.fulfilled, (state, action) => {
                state.loading = false
                state.meetings = action.payload.content
                state.totalPages = action.payload.totalPages
                state.totalElements = action.payload.totalElements
            })
            .addCase(fetchMeetings.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })

            // ================= FETCH DETAIL =================
            .addCase(fetchMeetingDetail.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchMeetingDetail.fulfilled, (state, action) => {
                state.loading = false
                state.selectedMeeting = action.payload
            })
            .addCase(fetchMeetingDetail.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })

            // ================= CREATE =================
            .addCase(createMeetingThunk.pending, (state) => {
                state.actionLoading = true
                state.error = null
            })
            .addCase(createMeetingThunk.fulfilled, (state, action) => {
                state.actionLoading = false
                state.meetings.unshift(action.payload)
            })
            .addCase(createMeetingThunk.rejected, (state, action) => {
                state.actionLoading = false
                state.error = action.payload as string
            })

            // ================= UPDATE =================
            .addCase(updateMeetingThunk.pending, (state) => {
                state.actionLoading = true
                state.error = null
            })
            .addCase(updateMeetingThunk.fulfilled, (state, action) => {
                state.actionLoading = false

                const index = state.meetings.findIndex(
                    (m) => m.id === action.payload.id
                )

                if (index !== -1) {
                    state.meetings[index] = action.payload
                }

                if (state.selectedMeeting?.id === action.payload.id) {
                    state.selectedMeeting = {
                        ...state.selectedMeeting,
                        ...action.payload,
                    }
                }
            })
            .addCase(updateMeetingThunk.rejected, (state, action) => {
                state.actionLoading = false
                state.error = action.payload as string
            })

            // ================= DELETE =================
            .addCase(deleteMeetingThunk.pending, (state) => {
                state.actionLoading = true
                state.error = null
            })
            .addCase(deleteMeetingThunk.fulfilled, (state, action) => {
                state.actionLoading = false

                state.meetings = state.meetings.filter(
                    (m) => m.id !== action.payload
                )

                if (state.selectedMeeting?.id === action.payload) {
                    state.selectedMeeting = null
                }
            })
            .addCase(deleteMeetingThunk.rejected, (state, action) => {
                state.actionLoading = false
                state.error = action.payload as string
            })

            // ================= UPCOMING =================
            .addCase(fetchUpcomingMeetings.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchUpcomingMeetings.fulfilled, (state, action) => {
                state.loading = false
                state.upcomingMeetings = action.payload
            })
            .addCase(fetchUpcomingMeetings.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })

            // ================= ADD PARTICIPANTS =================
            .addCase(addParticipantsThunk.pending, (state) => {
                state.actionLoading = true
                state.error = null
            })
            .addCase(addParticipantsThunk.fulfilled, (state) => {
                state.actionLoading = false
            })
            .addCase(addParticipantsThunk.rejected, (state, action) => {
                state.actionLoading = false
                state.error = action.payload as string
            })
    }

})


export const { clearSelectedMeeting } = meetingsSlice.actions
export default meetingsSlice.reducer

