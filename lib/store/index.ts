import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./auth/authSlice"
import meetingReducer from "./meeting/meetingSlice"
import actionItemReducer from "./actionItem/actionItemSlice"
import businessGoalReducer from "./businessGoal/businessGoalSlice"
import concernReducer from "./concern/concernSlice"
import suggestionReducer from "./suggestion/suggestionSlice"
import transcriptReducer from "./transcript/transcriptSlice"
import dashboardReducer from "./dashboard/dashboardSlice"


export const store = configureStore({
  reducer: {
    auth: authReducer,
    meetings: meetingReducer,
    actions: actionItemReducer,
    businessGoals: businessGoalReducer,
    concerns: concernReducer,
    suggestions: suggestionReducer,
    transcripts: transcriptReducer,
    dashboard: dashboardReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch