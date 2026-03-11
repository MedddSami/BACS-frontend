import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { ActionItemResponse, ActionStatus } from "./actionItemType"
import { actionApi } from "@/lib/api/ActionItemApi"

interface ActionState {
    actions: ActionItemResponse[]
    selectedAction?: ActionItemResponse
    overdue: ActionItemResponse[]

    totalElements: number
    totalPages: number
    page: number
    size: number

    loading: boolean
    error: string | null
}

const initialState: ActionState = {
    actions: [],
    overdue: [],
    totalElements: 0,
    totalPages: 0,
    page: 0,
    size: 10,
    loading: false,
    error: null,
}


export const fetchMyActions = createAsyncThunk(
    "actions/fetchMyActions",
    async (
        { page = 0, size = 10 }: { page?: number; size?: number },
        { rejectWithValue }
    ) => {
        try {
            return await actionApi.getMyActions(page, size)
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Failed")
        }
    }
)


export const fetchMyActionsByStatus = createAsyncThunk(
    "actions/fetchMyActionsByStatus",
    async (
        { status, page = 0, size = 10 }: any,
        { rejectWithValue }
    ) => {
        try {
            return await actionApi.getMyActionsByStatus(status, page, size)
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message)
        }
    }
)


export const fetchOverdueActions = createAsyncThunk(
    "actions/fetchOverdue",
    async (_, { rejectWithValue }) => {
        try {
            return await actionApi.getOverdueActions()
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message)
        }
    }
)


export const updateActionStatus = createAsyncThunk(
    "actions/updateStatus",
    async (
        { id, status }: { id: number; status: ActionStatus },
        { rejectWithValue }
    ) => {
        try {
            return await actionApi.updateStatus(id, status)
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message)
        }
    }
)


export const assignAction = createAsyncThunk(
    "actions/assign",
    async (
        { id, assigneeId }: { id: number; assigneeId: number },
        { rejectWithValue }
    ) => {
        try {
            return await actionApi.assignAction(id, assigneeId)
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message)
        }
    }
)


export const deleteAction = createAsyncThunk(
    "actions/delete",
    async (id: number, { rejectWithValue }) => {
        try {
            await actionApi.deleteAction(id)
            return id
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message)
        }
    }
)


const actionsSlice = createSlice({
    name: "actions",
    initialState,
    reducers: {
        clearSelectedAction: state => {
            state.selectedAction = undefined
        },
        clearActionsError: state => {
            state.error = null
        },
    },
    extraReducers: builder => {
        /* ===================================================== */
        /* FETCH MY ACTIONS */
        /* ===================================================== */
        builder
            .addCase(fetchMyActions.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchMyActions.fulfilled, (state, action) => {
                state.loading = false
                state.actions = action.payload.content
                state.totalElements = action.payload.totalElements
                state.totalPages = action.payload.totalPages
                state.page = action.payload.number
                state.size = action.payload.size
            })
            .addCase(fetchMyActions.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })

        /* ===================================================== */
        /* FETCH BY STATUS */
        /* ===================================================== */
        builder
            .addCase(fetchMyActionsByStatus.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchMyActionsByStatus.fulfilled, (state, action) => {
                state.loading = false
                state.actions = action.payload.content
                state.totalElements = action.payload.totalElements
                state.totalPages = action.payload.totalPages
                state.page = action.payload.number
                state.size = action.payload.size
            })
            .addCase(fetchMyActionsByStatus.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })

        /* ===================================================== */
        /* FETCH OVERDUE */
        /* ===================================================== */
        builder
            .addCase(fetchOverdueActions.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchOverdueActions.fulfilled, (state, action) => {
                state.loading = false
                state.overdue = action.payload
            })
            .addCase(fetchOverdueActions.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })

        /* ===================================================== */
        /* UPDATE STATUS */
        /* ===================================================== */
        builder
            .addCase(updateActionStatus.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(updateActionStatus.fulfilled, (state, action) => {
                state.loading = false

                const index = state.actions.findIndex(
                    a => a.id === action.payload.id
                )

                if (index !== -1) {
                    state.actions[index] = action.payload
                }

                if (state.selectedAction?.id === action.payload.id) {
                    state.selectedAction = action.payload
                }
            })
            .addCase(updateActionStatus.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })

        /* ===================================================== */
        /* ASSIGN ACTION */
        /* ===================================================== */
        builder
            .addCase(assignAction.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(assignAction.fulfilled, (state, action) => {
                state.loading = false

                const index = state.actions.findIndex(
                    a => a.id === action.payload.id
                )

                if (index !== -1) {
                    state.actions[index] = action.payload
                }
            })
            .addCase(assignAction.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })

        /* ===================================================== */
        /* DELETE ACTION */
        /* ===================================================== */
        builder
            .addCase(deleteAction.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(deleteAction.fulfilled, (state, action) => {
                state.loading = false
                state.actions = state.actions.filter(
                    a => a.id !== action.payload
                )

                if (state.selectedAction?.id === action.payload) {
                    state.selectedAction = undefined
                }
            })
            .addCase(deleteAction.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

export const {
    clearSelectedAction,
    clearActionsError,
} = actionsSlice.actions

export default actionsSlice.reducer

