"use client"

import { useAppSelector } from "@/lib/store/hooks"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, loading, accessToken, rehydrated } = useAppSelector(s => s.auth)
    const router = useRouter()

    useEffect(() => {
        if (rehydrated && !user && !accessToken) {
            router.replace("/login")
        }
    }, [rehydrated, user, accessToken, router])

    if (!rehydrated || loading) return null

    // ⛔ token exists but user not loaded yet
    if (accessToken && !user) return null

    return <>{children}</>
}
