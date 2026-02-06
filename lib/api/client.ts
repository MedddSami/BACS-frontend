import api from "@/lib/store/api/baseQuery"
import {
  LoginRequest,
  TwoFactorVerifyRequest,
  AuthResponse,
  ApiResponse,
} from "@/lib/store/auth/authTypes"

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await api.post<ApiResponse<AuthResponse>>(
      "/api/auth/login",
      data
    )
    return res.data.data
  },

  verify2FA: async (
    data: TwoFactorVerifyRequest
  ): Promise<AuthResponse> => {
    const res = await api.post<ApiResponse<AuthResponse>>(
      "/api/auth/login/2fa",
      data
    )
    return res.data.data
  },

  logout: async (refreshToken?: string) => {
    await api.post("/api/auth/logout", { refreshToken })
  },

  logoutAll: async () => {
    await api.post("/api/auth/logout-all")
  }
}
