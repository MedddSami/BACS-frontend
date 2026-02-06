"use client"

import { Provider } from "react-redux"
import { store } from "./index"
import { useEffect } from "react"
import { rehydrateAuth } from "./auth/authThunks"

function InitAuth({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.dispatch(rehydrateAuth())
  }, [])

  return <>{children}</>
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>
}
