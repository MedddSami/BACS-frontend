
import { RootState } from ".."

export const selectUserRole = (state: RootState) =>
  state.auth.user?.role

export const isAdmin = (state: RootState) =>
  state.auth.user?.role === "ADMIN"

export const isManager = (state: RootState) =>
  ["ADMIN", "MANAGER"].includes(state.auth.user?.role ?? "")

export const selectAuthState = (state: RootState) => state.auth

export const selectIsAuthenticated = (state: RootState) =>
  Boolean(state.auth.accessToken && state.auth.user)

export const selectAuthUser = (state: RootState) => state.auth.user

export const selectAuthRole = (state: RootState) =>
  state.auth.user?.role

export const selectAuthLoading = (state: RootState) =>
  state.auth.loading

export const selectRequiresTwoFactor = (state: RootState) =>
  state.auth.requiresTwoFactor