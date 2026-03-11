"use client"

import { Provider } from "react-redux"
import { store } from "./index"
import { useEffect } from "react"
import { rehydrateAuth } from "./auth/authThunks"
import { finishRehydration } from "./auth/authSlice"

import { useAppDispatch } from "./hooks"

function InitAuth({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (token) {
      dispatch(rehydrateAuth())
    } else {
      dispatch(finishRehydration())
    }
  }, [dispatch])

  return <>{children}</>
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <InitAuth>
                {children}
            </InitAuth>
        </Provider>
    )
}
