"use client"

import type React from "react"
import { createContext, useContext } from "react"
import { useMeetings, useActions } from "@/lib/hooks/use-meetings"

interface AppContextType {
  meetings: ReturnType<typeof useMeetings>
  actions: ReturnType<typeof useActions>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const meetings = useMeetings()
  const actions = useActions()

  return <AppContext.Provider value={{ meetings, actions }}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within AppProvider")
  }
  return context
}
