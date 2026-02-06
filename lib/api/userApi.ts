import api from "@/lib/store/api/baseQuery"
import { ApiResponse } from "@/lib/store/auth/authTypes"
import { UserResponse } from "@/lib/store/auth/authTypes"

export const userApi = {
    getMe: async (): Promise<UserResponse> => {
        const res = await api.get<ApiResponse<UserResponse>>("/api/users/me")
        return res.data.data
    },

    getUsersByOrganization: async (orgId: number): Promise<UserResponse[]> => {
        const res = await api.get<ApiResponse<UserResponse[]>>(
            `/api/users/organization/${orgId}`
        )
        return res.data.data
    },
}
