import { createAsyncThunk } from "@reduxjs/toolkit"
import { authApi } from "@/lib/api/client"
import { userApi } from "@/lib/api/userApi"
import { AuthResponse, UserResponse } from "./authTypes"
import { RootState } from "../index"

/**
 * 🔐 LOGIN
 */
export const login = createAsyncThunk<
  AuthResponse,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (payload, { rejectWithValue }) => {
  try {
    return await authApi.login(payload)
  } catch (e: any) {
    return rejectWithValue(e.message ?? "Login failed")
  }
})

/**
 * 🔐 VERIFY 2FA
 */
export const verifyTwoFactor = createAsyncThunk<
  AuthResponse,
  { email: string; password: string; code: string },
  { rejectValue: string }
>("auth/verify2fa", async (payload, { rejectWithValue }) => {
  try {
    return await authApi.verify2FA({
      email: payload.email,
      password: payload.password,
      twoFactorCode: payload.code,
    })
  } catch (e: any) {
    return rejectWithValue(e.message ?? "2FA verification failed")
  }
})

/**
 * 🔄 REHYDRATE SESSION (ON APP LOAD)
 */
export const rehydrateAuth = createAsyncThunk<
  UserResponse,
  void,
  { state: RootState; rejectValue: string }
>("auth/rehydrate", async (_, { rejectWithValue }) => {
  const accessToken = localStorage.getItem("access_token")
  const refreshToken = localStorage.getItem("refresh_token")

  if (!accessToken || !refreshToken) {
    return rejectWithValue("No session")
  }

  try {
    return await userApi.getMe()
  } catch {
    localStorage.clear()
    return rejectWithValue("Session expired")
  }
})

/**
 * 🚪 LOGOUT
 */
export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async () => {
    try {
      await authApi.logout()
    } catch {
      // ignore logout API errors
    } finally {
      // 🔥 critical cleanup
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("persist:auth")
      
    }
  }
)
