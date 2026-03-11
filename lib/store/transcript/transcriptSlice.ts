import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TranscriptResponse, UploadTranscriptRequest } from "./transcriptTypes";
import { transcriptApi } from "@/lib/api/transcriptApi";

interface TranscriptState {
  transcript: TranscriptResponse | null;
  summary: string | null;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
}

const initialState: TranscriptState = {
  transcript: null,
  summary: null,
  loading: false,
  actionLoading: false,
  error: null,
};

const extractErrorMessage = (error: any): string =>
  error?.response?.data?.message || error?.message || "Something went wrong";

// Thunks
export const uploadAudio = createAsyncThunk<
  TranscriptResponse,
  { meetingId: number; file: File },
  { rejectValue: string }
>("transcripts/uploadAudio", async ({ meetingId, file }, { rejectWithValue }) => {
  try {
    return await transcriptApi.uploadAudio(meetingId, file);
  } catch (error: any) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const uploadTranscript = createAsyncThunk<
  TranscriptResponse,
  UploadTranscriptRequest,
  { rejectValue: string }
>("transcripts/uploadTranscript", async (payload, { rejectWithValue }) => {
  try {
    return await transcriptApi.uploadTranscript(payload);
  } catch (error: any) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const getTranscriptByMeeting = createAsyncThunk<
  TranscriptResponse,
  number,
  { rejectValue: string }
>("transcripts/getByMeeting", async (meetingId, { rejectWithValue }) => {
  try {
    return await transcriptApi.getByMeeting(meetingId);
  } catch (error: any) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const processTranscript = createAsyncThunk<
  TranscriptResponse,
  number,
  { rejectValue: string }
>("transcripts/process", async (id, { rejectWithValue }) => {
  try {
    return await transcriptApi.processTranscript(id);
  } catch (error: any) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const generateSummary = createAsyncThunk<
  string,
  number,
  { rejectValue: string }
>("transcripts/generateSummary", async (id, { rejectWithValue }) => {
  try {
    return await transcriptApi.generateSummary(id);
  } catch (error: any) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

// Slice
export const transcriptSlice = createSlice({
  name: "transcripts",
  initialState,
  reducers: {
    clearTranscript: (state) => {
      state.transcript = null;
      state.summary = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // uploadAudio
    builder
      .addCase(uploadAudio.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(uploadAudio.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.transcript = action.payload;
      })
      .addCase(uploadAudio.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload ?? "Failed to upload audio";
      });

    // uploadTranscript
    builder
      .addCase(uploadTranscript.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(uploadTranscript.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.transcript = action.payload;
      })
      .addCase(uploadTranscript.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload ?? "Failed to upload transcript";
      });

    // getTranscriptByMeeting
    builder
      .addCase(getTranscriptByMeeting.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTranscriptByMeeting.fulfilled, (state, action) => {
        state.loading = false;
        state.transcript = action.payload;
      })
      .addCase(getTranscriptByMeeting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch transcript";
      });

    // processTranscript
    builder
      .addCase(processTranscript.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(processTranscript.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.transcript = action.payload;
      })
      .addCase(processTranscript.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload ?? "Failed to process transcript";
      });

    // generateSummary
    builder
      .addCase(generateSummary.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(generateSummary.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.summary = action.payload;
      })
      .addCase(generateSummary.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload ?? "Failed to generate summary";
      });
  },
});

export const { clearTranscript } = transcriptSlice.actions;
export default transcriptSlice.reducer;