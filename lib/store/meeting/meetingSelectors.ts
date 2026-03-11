import { RootState } from ".."

export const selectMeetings = (state: RootState) =>
    state.meetings.meetings

export const selectUpcomingMeetings = (state: RootState) =>
    state.meetings.upcomingMeetings

export const selectSelectedMeeting = (state: RootState) =>
    state.meetings.selectedMeeting

export const selectMeetingsLoading = (state: RootState) =>
    state.meetings.loading

export const selectMeetingsError = (state: RootState) =>
    state.meetings.error

export const selectMeetingsPagination = (state: RootState) => ({
    page: state.meetings.page,
    totalPages: state.meetings.totalPages,
    totalElements: state.meetings.totalElements,
})
