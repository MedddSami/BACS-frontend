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
    error?: string
}

const initialState: AuthState = {
    user: null,
    accessToken: null,
    refreshToken: null,

    isAuthenticated: false,
    requiresTwoFactor: false,

    loading: false,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout(state) {
            return initialState
        },
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
            })
            .addCase(rehydrateAuth.rejected, state => {
                state.loading = false
                state.user = null
                state.accessToken = null
                state.refreshToken = null
            })
    },
})


export default authSlice.reducer