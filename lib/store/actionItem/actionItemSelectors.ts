import { RootState } from ".."

export const selectActions = (state: RootState) =>
  state.actions.actions

export const selectActionsLoading = (state: RootState) =>
  state.actions.loading

export const selectOverdueActions = (state: RootState) =>
  state.actions.overdue
