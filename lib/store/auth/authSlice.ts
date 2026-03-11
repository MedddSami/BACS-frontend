import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AuthResponse, UserResponse } from "./authTypes"
import { login, logoutThunk, rehydrateAuth, verifyTwoFactor } from "./authThunks"

interface AuthState {
    user: AuthResponse["user"] | null
    accessToken: string | null
    refreshToken: string | null

    isAuthenticated: boolean
    requiresTwoFactor: boolean
    twoFactorToken?: string

    loading: boolean
    rehydrated: boolean // NEW: To track if rehydration attempt finished
    error?: string
}

const initialState: AuthState = {
    user: null,
    accessToken: typeof window !== "undefined" ? localStorage.getItem("access_token") : null,
    refreshToken: typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null,

    isAuthenticated: false,
    requiresTwoFactor: false,

    loading: typeof window !== "undefined" && !!localStorage.getItem("access_token"),
    rehydrated: false,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout(state) {
            state.user = null
            state.accessToken = null
            state.refreshToken = null
            state.isAuthenticated = false
            state.requiresTwoFactor = false
            state.loading = false
            state.rehydrated = true
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload
        },
        finishRehydration(state) {
            state.rehydrated = true
            state.loading = false
        }
    },
    extraReducers: builder => {
        // 🔐 LOGIN
        builder
            .addCase(login.pending, state => {
                state.loading = true
                state.error = undefined
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false

                // 🚨 2FA REQUIRED
                if (action.payload.requiresTwoFactor) {
                    state.requiresTwoFactor = true
                    state.twoFactorToken = action.payload.twoFactorToken
                    return
                }

                // ✅ AUTHENTICATED
                state.user = action.payload.user
                state.accessToken = action.payload.accessToken
                state.refreshToken = action.payload.refreshToken
                state.isAuthenticated = true
                state.rehydrated = true
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })

        // 🔐 VERIFY 2FA
        builder
            .addCase(verifyTwoFactor.pending, state => {
                state.loading = true
                state.error = undefined
            })
            .addCase(verifyTwoFactor.fulfilled, (state, action) => {
                state.loading = false
                state.requiresTwoFactor = false

                state.user = action.payload.user
                state.accessToken = action.payload.accessToken
                state.refreshToken = action.payload.refreshToken
                state.isAuthenticated = true
                state.rehydrated = true
            })
            .addCase(verifyTwoFactor.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
        
        //Rehydrate auth
        builder    
            .addCase(rehydrateAuth.pending, state => {
                state.loading = true
            })
            .addCase(rehydrateAuth.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload
                state.accessToken = localStorage.getItem("access_token")
                state.refreshToken = localStorage.getItem("refresh_token")
                state.isAuthenticated = true
                state.rehydrated = true
            })
            .addCase(rehydrateAuth.rejected, state => {
                state.loading = false
                state.user = null
                state.accessToken = null
                state.refreshToken = null
                state.isAuthenticated = false
                state.rehydrated = true
            })

        // 🚪 LOGOUT
        builder
            .addCase(logoutThunk.pending, state => {
                state.loading = true
            })
            .addCase(logoutThunk.fulfilled, state => {
                state.user = null
                state.accessToken = null
                state.refreshToken = null
                state.isAuthenticated = false
                state.requiresTwoFactor = false
                state.loading = false
                state.rehydrated = true
            })
            .addCase(logoutThunk.rejected, state => {
                // still clear state even if API fails
                state.user = null
                state.accessToken = null
                state.refreshToken = null
                state.isAuthenticated = false
                state.requiresTwoFactor = false
                state.loading = false
                state.rehydrated = true
            })
    },
})

export const { logout, setLoading, finishRehydration } = authSlice.actions


export default authSlice.reducer