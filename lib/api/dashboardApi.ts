import api from "../store/api/baseQuery"
import { DashboardResponse } from "../store/dashboard/dashboardTypes"


export const dashboardApi = {
  getMyDashboard: async () => {
    return await api.get<{ data: DashboardResponse }>("/api/dashboard/my")
  }
}