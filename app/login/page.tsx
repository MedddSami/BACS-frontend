"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { login, verifyTwoFactor } from "@/lib/store/auth/authThunks"
import { selectIsAuthenticated, selectRequiresTwoFactor } from "@/lib/store/auth/authSelectors"
import Image from "next/image"

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const { user, requiresTwoFactor, loading } = useAppSelector(s => s.auth)

  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [twoFactorCode, setTwoFactorCode] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (user && !requiresTwoFactor && isAuthenticated) {
      console.log("user", user)
      router.replace("/dashboard")
    }
  }, [user, requiresTwoFactor, isAuthenticated])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (requiresTwoFactor) {
        await dispatch(
          verifyTwoFactor({ email, password, code: twoFactorCode })
        ).unwrap()
        router.push("/")
      } else {
        await dispatch(login({ email, password })).unwrap()
      }
      router.replace("/dashboard")
    } catch (e) {
      setError("Authentication failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl justify-items-center">
            <Image
              className="items-center"
              src="/logo_bacs+.jpg"
              alt="BACS+"
              width={250}
              height={60}
              priority
            />
          </CardTitle>
          <CardDescription>
            {requiresTwoFactor ? "Enter your two-factor authentication code" : "Sign in to your account to continue"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {requiresTwoFactor ? (
              <div className="space-y-2">
                <Label htmlFor="twoFactorCode">Verification Code</Label>
                <Input
                  id="twoFactorCode"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  disabled={loading}
                  maxLength={6}
                  required
                />
                <p className="text-xs text-muted-foreground">Enter the 6-digit code from your authenticator app</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/reset-password" className="text-xs text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </>
            )}

            {error && (
              <div className="flex gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {!requiresTwoFactor && (
              <div className="space-y-2 text-xs text-muted-foreground pt-2">
              </div>
            )}

            <div className="flex gap-2">
              {requiresTwoFactor && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => {
                    setTwoFactorCode("")
                    setError("")
                  }}
                  disabled={loading}
                >
                  Back
                </Button>
              )}
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? "Verifying..." : requiresTwoFactor ? "Verify Code" : "Sign In"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
