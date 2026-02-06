"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/lib/store/hooks"
import { selectIsAuthenticated } from "@/lib/store/auth/authSelectors"

export default function Home() {
  const router = useRouter()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    } else {
      router.push("/showcase")
    }
  }, [isAuthenticated, router])

  return null
}
