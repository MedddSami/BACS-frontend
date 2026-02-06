"use client"

import { useAppSelector } from "@/lib/store/hooks"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, loading, accessToken } = useAppSelector(s => s.auth)
    const router = useRouter()

    console.log({ loading, user, accessToken })


    useEffect(() => {
        if (!loading && !user && !accessToken) {
            router.replace("/login")
        }
    }, [loading, user, accessToken, router])

    if (loading) return null

    // ⛔ token exists but user not loaded yet
    if (accessToken && !user) return null

    return <>{children}</>
}
