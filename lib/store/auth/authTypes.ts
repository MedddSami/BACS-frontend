export interface LoginRequest {
    email: string
    password: string
}

export interface TwoFactorVerifyRequest {
    email: string
    password: string
    twoFactorCode: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  tokenType: "Bearer"
  expiresIn: number
  user: UserResponse
  requiresTwoFactor: boolean
  twoFactorToken?: string
}

export interface ApiResponse<T> {
    success: boolean
    message: string
    data: T
}

export interface UserResponse {
  id: number
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatarUrl?: string
  role: "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "EMPLOYEE" | "GUEST"
  active: boolean
  organizationId: number
  organizationName: string
}