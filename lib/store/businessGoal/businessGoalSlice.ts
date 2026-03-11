// businessGoal.slice.ts
import {
    createSlice,
    createAsyncThunk,
    PayloadAction,
} from "@reduxjs/toolkit";
import { BusinessGoal, BusinessGoalStatus, CreateBusinessGoalRequest, PageResponse, UpdateBusinessGoalRequest } from "./businessGoalTypes";
import { businessGoalApi } from "@/lib/api/BusinessGoalApi";

interface BusinessGoalState {
    goals: BusinessGoal[];
    selectedGoal?: BusinessGoal;
    page?: PageResponse<BusinessGoal>;

    loading: boolean;        // for GET operations
    actionLoading: boolean;  // for CREATE/UPDATE/PATCH/DELETE

    error?: string | null;
}

const initialState: BusinessGoalState = {
    goals: [],
    loading: false,
    actionLoading: false,
    error: null,
};

const extractErrorMessage = (error: any): string => {
    return (
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong"
    );
};

export const createGoal = createAsyncThunk<
    BusinessGoal,
    CreateBusinessGoalRequest,
    { rejectValue: string }
>("businessGoals/create", async (payload, { rejectWithValue }) => {
    try {
        return await businessGoalApi.create(payload);
    } catch (error: any) {
        return rejectWithValue(extractErrorMessage(error));
    }
});

export const fetchGoalById = createAsyncThunk<
    BusinessGoal,
    number,
    { rejectValue: string }
>("businessGoals/getById", async (id, { rejectWithValue }) => {
    try {
        return await businessGoalApi.getById(id);
    } catch (error: any) {
        return rejectWithValue(extractErrorMessage(error));
    }
});

export const updateGoal = createAsyncThunk<
    BusinessGoal,
    { id: number; payload: UpdateBusinessGoalRequest },
    { rejectValue: string }
>("businessGoals/update", async ({ id, payload }, { rejectWithValue }) => {
    try {
        return await businessGoalApi.update(id, payload);
    } catch (error: any) {
        return rejectWithValue(extractErrorMessage(error));
    }
});

export const deleteGoal = createAsyncThunk<
    number,
    number,
    { rejectValue: string }
>("businessGoals/delete", async (id, { rejectWithValue }) => {
    try {
        return await businessGoalApi.delete(id);
    } catch (error: any) {
        return rejectWithValue(extractErrorMessage(error));
    }
});

export const fetchGoalsByMeeting = createAsyncThunk<
    BusinessGoal[],
    number,
    { rejectValue: string }
>("businessGoals/byMeeting", async (meetingId, { rejectWithValue }) => {
    try {
        return await businessGoalApi.getByMeeting(meetingId);
    } catch (error: any) {
        return rejectWithValue(extractErrorMessage(error));
    }
});

export const fetchGoalsByOwner = createAsyncThunk<
    PageResponse<BusinessGoal>,
    { ownerId: number; page?: number; size?: number },
    { rejectValue: string }
>(
    "businessGoals/byOwner",
    async ({ ownerId, page = 0, size = 10 }, { rejectWithValue }) => {
        try {
            return await businessGoalApi.getByOwner(ownerId, page, size);
        } catch (error: any) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
);

export const fetchGoalsByStatus = createAsyncThunk<
    BusinessGoal[],
    BusinessGoalStatus,
    { rejectValue: string }
>(
    "businessGoals/byStatus",
    async (status, { rejectWithValue }) => {
        try {
            return await businessGoalApi.getByStatus(status);
        } catch (error: any) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
);

export const fetchOverdueGoals = createAsyncThunk<
    BusinessGoal[],
    void,
    { rejectValue: string }
>(
    "businessGoals/overdue",
    async (_, { rejectWithValue }) => {
        try {
            return await businessGoalApi.getOverdue();
        } catch (error: any) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
);

export const fetchActiveByOrganization = createAsyncThunk<
    BusinessGoal[],
    number,
    { rejectValue: string }
>(
    "businessGoals/activeByOrganization",
    async (organizationId, { rejectWithValue }) => {
        try {
            return await businessGoalApi.getActiveByOrganization(organizationId);
        } catch (error: any) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
);

export const updateGoalStatus = createAsyncThunk<
    BusinessGoal,
    { id: number; status: BusinessGoalStatus },
    { rejectValue: string }
>(
    "businessGoals/updateStatus",
    async ({ id, status }, { rejectWithValue }) => {
        try {
            return await businessGoalApi.updateStatus(id, status);
        } catch (error: any) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
);

export const assignGoalOwner = createAsyncThunk<
    { id: number; ownerId: number },
    { id: number; ownerId: number },
    { rejectValue: string }
>(
    "businessGoals/assignOwner",
    async ({ id, ownerId }, { rejectWithValue }) => {
        try {
            return await businessGoalApi.assignOwner(id, ownerId);
        } catch (error: any) {
            return rejectWithValue(extractErrorMessage(error));
        }
    }
);

const businessGoalSlice = createSlice({
    name: "businessGoals",
    initialState,
    reducers: {
        clearSelectedGoal: (state) => {
            state.selectedGoal = undefined;
        },
    },
    extraReducers: (builder) => {
        builder
            // CREATE
            .addCase(createGoal.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(createGoal.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.goals.push(action.payload);
            })
            .addCase(createGoal.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload || "Create failed";
            })

            // FETCH GOALS BY MEETING
            .addCase(fetchGoalsByMeeting.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGoalsByMeeting.fulfilled, (state, action) => {
                state.loading = false;
                state.goals = action.payload;
            })
            .addCase(fetchGoalsByMeeting.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Fetch failed";
            })

            // UPDATE 
            .addCase(updateGoal.pending, (state) => {
                state.actionLoading = true;
            })
            .addCase(updateGoal.fulfilled, (state, action) => {
                state.actionLoading = false;
                const index = state.goals.findIndex(
                    (g) => g.id === action.payload.id
                );
                if (index !== -1) {
                    state.goals[index] = action.payload;
                }
            })
            .addCase(updateGoal.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload || "Update failed";
            })

            // DELETE
            .addCase(deleteGoal.pending, (state) => {
                state.actionLoading = true;
            })
            .addCase(deleteGoal.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.goals = state.goals.filter(
                    (g) => g.id !== action.payload
                );
            })
            .addCase(deleteGoal.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload || "Delete failed";
            })

            // FETCH GOAL BY OWNER
            .addCase(fetchGoalsByOwner.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGoalsByOwner.fulfilled, (state, action) => {
                state.loading = false;
                state.page = action.payload;
                state.goals = action.payload.content;
            })
            .addCase(fetchGoalsByOwner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch goals by owner";
            })

            // FETCH GOAL BY STATUS
            .addCase(fetchGoalsByStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGoalsByStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.goals = action.payload;
            })
            .addCase(fetchGoalsByStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch goals by status";
            })

            // FETCH OVERDUE GOALS
            .addCase(fetchOverdueGoals.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOverdueGoals.fulfilled, (state, action) => {
                state.loading = false;
                state.goals = action.payload;
            })
            .addCase(fetchOverdueGoals.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch overdue goals";
            })

            // FETCH ACTIVE BY ORGANIZATION
            .addCase(fetchActiveByOrganization.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchActiveByOrganization.fulfilled, (state, action) => {
                state.loading = false;
                state.goals = action.payload;
            })
            .addCase(fetchActiveByOrganization.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch active goals";
            })

            // UPDATE GOAL STATUS
            .addCase(updateGoalStatus.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(updateGoalStatus.fulfilled, (state, action) => {
                state.actionLoading = false;

                const index = state.goals.findIndex(
                    (g) => g.id === action.payload.id
                );

                if (index !== -1) {
                    state.goals[index] = action.payload;
                }

                if (state.selectedGoal?.id === action.payload.id) {
                    state.selectedGoal = action.payload;
                }
            })
            .addCase(updateGoalStatus.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload || "Failed to update status";
            })

            // ASSIGN GOAL OWNER
            .addCase(assignGoalOwner.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(assignGoalOwner.fulfilled, (state, action) => {
                state.actionLoading = false;

                const goal = state.goals.find((g) => g.id === action.payload.id);

                if (goal) {
                    goal.owner = {
                        ...goal.owner,
                        id: action.payload.ownerId,
                    } as any; // ideally refetch or update properly
                }

                if (state.selectedGoal?.id === action.payload.id) {
                    state.selectedGoal.owner = {
                        ...state.selectedGoal.owner,
                        id: action.payload.ownerId,
                    } as any;
                }
            })
            .addCase(assignGoalOwner.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload || "Failed to assign owner";
            })
    },
});

export const { clearSelectedGoal } = businessGoalSlice.actions;
export default businessGoalSlice.reducer;