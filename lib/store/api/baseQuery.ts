import axios, { AxiosError, AxiosInstance } from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

let isRefreshing = false
let refreshPromise: Promise<string> | null = null

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

/* ───────────────────────────────────────────── */
/* Token helpers                                  */
/* ───────────────────────────────────────────── */

const getAccessToken = () =>
  typeof window !== "undefined"
    ? localStorage.getItem("access_token")
    : null

const getRefreshToken = () =>
  typeof window !== "undefined"
    ? localStorage.getItem("refresh_token")
    : null

const setTokens = (access: string, refresh: string) => {
  localStorage.setItem("access_token", access)
  localStorage.setItem("refresh_token", refresh)
}

const clearTokens = () => {
  localStorage.removeItem("access_token")
  localStorage.removeItem("refresh_token")
}

/* ───────────────────────────────────────────── */
/* Request interceptor                            */
/* ───────────────────────────────────────────── */

api.interceptors.request.use(config => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(res => {
  const tokens = res.data?.data
  if (tokens?.accessToken) {
    localStorage.setItem("access_token", tokens.accessToken)
    localStorage.setItem("refresh_token", tokens.refreshToken)
  }
  return res
})


/* ───────────────────────────────────────────── */
/* Response interceptor (silent refresh)          */
/* ───────────────────────────────────────────── */

api.interceptors.response.use(
  res => res,
  async (error: AxiosError<any>) => {
    const originalRequest: any = error.config

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      if (!refreshPromise) {
        refreshPromise = api
          .post("/api/auth/refresh", {
            refreshToken: getRefreshToken(),
          })
          .then(res => {
            const { accessToken, refreshToken } = res.data.data
            setTokens(accessToken, refreshToken)
            return accessToken
          })
          .catch(err => {
            clearTokens()
            window.location.href = "/login"
            throw err
          })
          .finally(() => {
            refreshPromise = null
          })
      }

      const newToken = await refreshPromise
      originalRequest.headers.Authorization = `Bearer ${newToken}`
      return api(originalRequest)
    }

    return Promise.reject(error)
  }
)

export default api
