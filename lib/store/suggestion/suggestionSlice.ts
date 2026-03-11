import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CreateSuggestionRequest, ImplementSuggestionRequest, PageResponse, RejectSuggestionRequest, Suggestion, UpdateSuggestionRequest } from "./suggestionTypes";
import { suggestionApi } from "@/lib/api/suggestionApi";

interface SuggestionState {
    suggestions: Suggestion[];
    selectedSuggestion?: Suggestion;

    pageData?: PageResponse<Suggestion>;

    loading: boolean;
    actionLoading: boolean;
    error: string | null;
}

const initialState: SuggestionState = {
    suggestions: [],
    loading: false,
    actionLoading: false,
    error: null,
};

const extractErrorMessage = (error: any): string =>
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong";

export const createSuggestion = createAsyncThunk<
    Suggestion,
    CreateSuggestionRequest,
    { rejectValue: string }
>("suggestions/create", async (payload, { rejectWithValue }) => {
    try {
        return await suggestionApi.create(payload);
    } catch (error: any) {
        return rejectWithValue(extractErrorMessage(error));
    }
});

export const fetchSuggestionsByMeeting = createAsyncThunk<
    Suggestion[],
    number,
    { rejectValue: string }
>("suggestions/byMeeting", async (meetingId, { rejectWithValue }) => {
    try {
        return await suggestionApi.getByMeeting(meetingId);
    } catch (error: any) {
        return rejectWithValue(extractErrorMessage(error));
    }
});

export const fetchSuggestionsByUser = createAsyncThunk<
    PageResponse<Suggestion>,
    { userId: number; page?: number; size?: number },
    { rejectValue: string }
>("suggestions/byUser", async ({ userId, page, size }, { rejectWithValue }) => {
    try {
        return await suggestionApi.getByUser(userId, page, size);
    } catch (error: any) {
        return rejectWithValue(extractErrorMessage(error));
    }
});

export const implementSuggestion = createAsyncThunk<
    Suggestion,
    { id: number; payload: ImplementSuggestionRequest },
    { rejectValue: string }
>("suggestions/implement", async ({ id, payload }, { rejectWithValue }) => {
    try {
        return await suggestionApi.implement(id, payload);
    } catch (error: any) {
        return rejectWithValue(extractErrorMessage(error));
    }
});

export const rejectSuggestion = createAsyncThunk<
    Suggestion,
    { id: number; payload: RejectSuggestionRequest },
    { rejectValue: string }
>("suggestions/reject", async ({ id, payload }, { rejectWithValue }) => {
    try {
        return await suggestionApi.reject(id, payload);
    } catch (error: any) {
        return rejectWithValue(extractErrorMessage(error));
    }
});

// GET by ID
export const fetchSuggestionById = createAsyncThunk<
    Suggestion,
    number,
    { rejectValue: string }
>("suggestions/fetchById", async (id, { rejectWithValue }) => {
    try {
        return await suggestionApi.getById(id);
    } catch (error: any) {
        return rejectWithValue(extractErrorMessage(error));
    }
});

// UPDATE suggestion
export const updateSuggestion = createAsyncThunk<
    Suggestion,
    { id: number; payload: UpdateSuggestionRequest },
    { rejectValue: string }
>("suggestions/update", async ({ id, payload }, { rejectWithValue }) => {
    try {
        return await suggestionApi.update(id, payload);
    } catch (error: any) {
        return rejectWithValue(extractErrorMessage(error));
    }
});

// DELETE suggestion
export const deleteSuggestion = createAsyncThunk<
    number,
    number,
    { rejectValue: string }
>("suggestions/delete", async (id, { rejectWithValue }) => {
    try {
        return await suggestionApi.delete(id);
    } catch (error: any) {
        return rejectWithValue(extractErrorMessage(error));
    }
});

// GET pending suggestions
export const fetchPendingSuggestions = createAsyncThunk<
    Suggestion[],
    void,
    { rejectValue: string }
>("suggestions/fetchPending", async (_, { rejectWithValue }) => {
    try {
        return await suggestionApi.getPending();
    } catch (error: any) {
        return rejectWithValue(extractErrorMessage(error));
    }
});

// GET implemented suggestions
export const fetchImplementedSuggestions = createAsyncThunk<
    Suggestion[],
    void,
    { rejectValue: string }
>("suggestions/fetchImplemented", async (_, { rejectWithValue }) => {
    try {
        return await suggestionApi.getImplemented();
    } catch (error: any) {
        return rejectWithValue(extractErrorMessage(error));
    }
});

// LINK actions to suggestion
export const linkActionsToSuggestion = createAsyncThunk<
    number,
    { id: number; actionIds: number[] },
    { rejectValue: string }
>("suggestions/linkActions", async ({ id, actionIds }, { rejectWithValue }) => {
    try {
        return await suggestionApi.linkActions(id, actionIds);
    } catch (error: any) {
        return rejectWithValue(extractErrorMessage(error));
    }
});

const suggestionSlice = createSlice({
    name: "suggestions",
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        builder
            .addCase(createSuggestion.pending, (state) => {
                state.actionLoading = true;
            })
            .addCase(createSuggestion.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.suggestions.push(action.payload);
            })
            .addCase(createSuggestion.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload ?? "Create failed";
            });

        // FETCH suggestions by meeting
        builder
            .addCase(fetchSuggestionsByMeeting.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSuggestionsByMeeting.fulfilled, (state, action) => {
                state.loading = false;
                state.suggestions = action.payload;
            })
            .addCase(fetchSuggestionsByMeeting.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Failed to fetch suggestions by meeting";
            });

        // FETCH suggestions by user (paginated)
        builder
            .addCase(fetchSuggestionsByUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSuggestionsByUser.fulfilled, (state, action) => {
                state.loading = false;
                state.pageData = action.payload;
                state.suggestions = action.payload.content;
            })
            .addCase(fetchSuggestionsByUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Failed to fetch suggestions by user";
            });

        // IMPLEMENT suggestion
        builder
            .addCase(implementSuggestion.pending, (state) => {
                state.actionLoading = true;
            })
            .addCase(implementSuggestion.fulfilled, (state, action) => {
                state.actionLoading = false;
                const index = state.suggestions.findIndex((s) => s.id === action.payload.id);
                if (index !== -1) state.suggestions[index] = action.payload;
            })
            .addCase(implementSuggestion.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload ?? "Failed to implement suggestion";
            });

        // REJECT suggestion
        builder
            .addCase(rejectSuggestion.pending, (state) => {
                state.actionLoading = true;
            })
            .addCase(rejectSuggestion.fulfilled, (state, action) => {
                state.actionLoading = false;
                const index = state.suggestions.findIndex((s) => s.id === action.payload.id);
                if (index !== -1) state.suggestions[index] = action.payload;
            })
            .addCase(rejectSuggestion.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload ?? "Failed to reject suggestion";
            });

        builder
            // FETCH by ID
            .addCase(fetchSuggestionById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSuggestionById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedSuggestion = action.payload;
            })
            .addCase(fetchSuggestionById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Failed to fetch suggestion by ID";
            })

            // UPDATE
            .addCase(updateSuggestion.pending, (state) => {
                state.actionLoading = true;
            })
            .addCase(updateSuggestion.fulfilled, (state, action) => {
                state.actionLoading = false;
                const index = state.suggestions.findIndex((s) => s.id === action.payload.id);
                if (index !== -1) state.suggestions[index] = action.payload;
            })
            .addCase(updateSuggestion.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload ?? "Failed to update suggestion";
            })

            // DELETE
            .addCase(deleteSuggestion.pending, (state) => {
                state.actionLoading = true;
            })
            .addCase(deleteSuggestion.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.suggestions = state.suggestions.filter((s) => s.id !== action.payload);
            })
            .addCase(deleteSuggestion.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload ?? "Failed to delete suggestion";
            })

            // FETCH pending
            .addCase(fetchPendingSuggestions.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPendingSuggestions.fulfilled, (state, action) => {
                state.loading = false;
                state.suggestions = action.payload;
            })
            .addCase(fetchPendingSuggestions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Failed to fetch pending suggestions";
            })

            // FETCH implemented
            .addCase(fetchImplementedSuggestions.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchImplementedSuggestions.fulfilled, (state, action) => {
                state.loading = false;
                state.suggestions = action.payload;
            })
            .addCase(fetchImplementedSuggestions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Failed to fetch implemented suggestions";
            })

            // LINK actions
            .addCase(linkActionsToSuggestion.pending, (state) => {
                state.actionLoading = true;
            })
            .addCase(linkActionsToSuggestion.fulfilled, (state) => {
                state.actionLoading = false;
            })
            .addCase(linkActionsToSuggestion.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload ?? "Failed to link actions to suggestion";
            })

    },
});

export default suggestionSlice.reducer;