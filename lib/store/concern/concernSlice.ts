import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Concern, CreateConcernRequest, PriorityLevel, ResolveConcernRequest, UpdateConcernRequest } from "./ConcernTypes";
import { concernApi } from "@/lib/api/concernApi";

interface ConcernState {
    concerns: Concern[];
    selectedConcern?: Concern;

    loading: boolean;
    actionLoading: boolean;

    error: string | null;
}

const initialState: ConcernState = {
    concerns: [],
    loading: false,
    actionLoading: false,
    error: null,
};

const extractErrorMessage = (error: any): string =>
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong";

export const createConcern = createAsyncThunk<
    Concern,
    CreateConcernRequest,
    { rejectValue: string }
>("concerns/create", async (payload, { rejectWithValue }) => {
    try {
        return await concernApi.create(payload);
    } catch (error: any) {
        return rejectWithValue(extractErrorMessage(error));
    }
});

export const fetchConcernById = createAsyncThunk<
    Concern,
    number,
    { rejectValue: string }
>("concerns/getById", async (id, { rejectWithValue }) => {
    try {
        return await concernApi.getById(id);
    } catch (error: any) {
        return rejectWithValue(extractErrorMessage(error));
    }
});

export const updateConcern = createAsyncThunk<
    Concern,
    { id: number; payload: UpdateConcernRequest },
    { rejectValue: string }
>("concerns/update", async ({ id, payload }, { rejectWithValue }) => {
    try {
        return await concernApi.update(id, payload);
    } catch (error: any) {
        return rejectWithValue(extractErrorMessage(error));
    }
});

export const deleteConcern = createAsyncThunk<
    number,
    number,
    { rejectValue: string }
>("concerns/delete", async (id, { rejectWithValue }) => {
    try {
        return await concernApi.delete(id);
    } catch (error: any) {
        return rejectWithValue(extractErrorMessage(error));
    }
});

export const fetchConcernsByMeeting = createAsyncThunk<
    Concern[],
    number,
    { rejectValue: string }
>("concerns/byMeeting", async (meetingId, { rejectWithValue }) => {
    try {
        return await concernApi.getByMeeting(meetingId);
    } catch (error: any) {
        return rejectWithValue(extractErrorMessage(error));
    }
});

export const fetchUnresolvedConcerns = createAsyncThunk<
    Concern[],
    void,
    { rejectValue: string }
>("concerns/unresolved", async (_, { rejectWithValue }) => {
    try {
        return await concernApi.getUnresolved();
    } catch (error: any) {
        return rejectWithValue(extractErrorMessage(error));
    }
});

export const fetchUnresolvedByOrganization = createAsyncThunk<
    Concern[],
    number,
    { rejectValue: string }
>("concerns/unresolvedByOrg", async (organizationId, { rejectWithValue }) => {
    try {
        return await concernApi.getUnresolvedByOrganization(organizationId);
    } catch (error: any) {
        return rejectWithValue(extractErrorMessage(error));
    }
});

export const fetchConcernsBySeverity = createAsyncThunk<
    Concern[],
    PriorityLevel,
    { rejectValue: string }
>("concerns/bySeverity", async (severity, { rejectWithValue }) => {
    try {
        return await concernApi.getBySeverity(severity);
    } catch (error: any) {
        return rejectWithValue(extractErrorMessage(error));
    }
});

export const resolveConcern = createAsyncThunk<
    Concern,
    { id: number; payload: ResolveConcernRequest },
    { rejectValue: string }
>("concerns/resolve", async ({ id, payload }, { rejectWithValue }) => {
    try {
        return await concernApi.resolve(id, payload);
    } catch (error: any) {
        return rejectWithValue(extractErrorMessage(error));
    }
});

export const escalateConcern = createAsyncThunk<
    number,
    { id: number; recipientIds: number[] },
    { rejectValue: string }
>("concerns/escalate", async ({ id, recipientIds }, { rejectWithValue }) => {
    try {
        return await concernApi.escalate(id, recipientIds);
    } catch (error: any) {
        return rejectWithValue(extractErrorMessage(error));
    }
});

export const linkActionsToConcern = createAsyncThunk<
    number,
    { id: number; actionIds: number[] },
    { rejectValue: string }
>("concerns/linkActions", async ({ id, actionIds }, { rejectWithValue }) => {
    try {
        return await concernApi.linkActions(id, actionIds);
    } catch (error: any) {
        return rejectWithValue(extractErrorMessage(error));
    }
});

const concernSlice = createSlice({
    name: "concerns",
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        /* ===== CREATE ===== */
        builder
            .addCase(createConcern.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(createConcern.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.concerns.push(action.payload);
            })
            .addCase(createConcern.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload ?? action.error.message ?? "Create failed";
            });

        /* ===== FETCH BY ID ===== */
        builder
            .addCase(fetchConcernById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchConcernById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedConcern = action.payload;
            })
            .addCase(fetchConcernById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? action.error.message ?? "Fetch failed";
            });

        /* ===== UPDATE ===== */
        builder.addCase(updateConcern.fulfilled, (state, action) => {
            const index = state.concerns.findIndex(
                (c) => c.id === action.payload.id
            );
            if (index !== -1) state.concerns[index] = action.payload;
        });

        /* ===== DELETE ===== */
        builder.addCase(deleteConcern.fulfilled, (state, action) => {
            state.concerns = state.concerns.filter(
                (c) => c.id !== action.payload
            );
        });

        /* ===== FETCH LISTS ===== */
        builder
            .addCase(fetchConcernsByMeeting.fulfilled, (state, action) => {
                state.concerns = action.payload;
            })
            .addCase(fetchUnresolvedConcerns.fulfilled, (state, action) => {
                state.concerns = action.payload;
            })
            .addCase(fetchUnresolvedByOrganization.fulfilled, (state, action) => {
                state.concerns = action.payload;
            })
            .addCase(fetchConcernsBySeverity.fulfilled, (state, action) => {
                state.concerns = action.payload;
            });

        /* ===== RESOLVE ===== */
        builder.addCase(resolveConcern.fulfilled, (state, action) => {
            const index = state.concerns.findIndex(
                (c) => c.id === action.payload.id
            );
            if (index !== -1) state.concerns[index] = action.payload;
        });
    }
})

export default concernSlice.reducer;
