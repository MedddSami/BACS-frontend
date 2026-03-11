import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { DashboardResponse } from "./dashboardTypes"
import { dashboardApi } from "@/lib/api/dashboardApi"

interface DashboardState {
  data: DashboardResponse | null
  loading: boolean
  error: string | null
}

const initialState: DashboardState = {
  data: null,
  loading: false,
  error: null
}

export const fetchMyDashboard = createAsyncThunk<
  DashboardResponse,
  void,
  { rejectValue: string }
>("dashboard/fetchMyDashboard", async (_, { rejectWithValue }) => {
  try {
    const response = await dashboardApi.getMyDashboard()
    return response.data.data // assuming ApiResponse.success()
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed")
  }
})

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchMyDashboard.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMyDashboard.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchMyDashboard.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Error"
      })
  }
})

export default dashboardSlice.reducer