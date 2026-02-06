"use client"

import type React from "react"

import { useState } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { AlertCircle, CheckCircle, Shield, Key } from "lucide-react"
import { useAppSelector } from "@/lib/store/hooks"

export default function SettingsPage() {
  const [language, setLanguage] = useState("en")
  const [summarization, setSummarization] = useState("detailed")
  const [syncGoogle, setSyncGoogle] = useState(false)
  const [syncTeams, setSyncTeams] = useState(false)
  const [syncZoom, setSyncZoom] = useState(false)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  const [twoFactorCode, setTwoFactorCode] = useState("")
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [twoFactorError, setTwoFactorError] = useState("")

  const { user, requiresTwoFactor, loading } = useAppSelector(s => s.auth)

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")
    setPasswordSuccess(false)

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match")
      return
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters")
      return
    }

    try {
      await changePassword(currentPassword, newPassword)
      setPasswordSuccess(true)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Failed to change password")
    }
  }

  const handleEnableTwoFactor = async () => {
    try {
      const qrCode = await enableTwoFactor()
      setQrCodeUrl(qrCode)
      setShowTwoFactorSetup(true)
      setTwoFactorError("")
    } catch (err) {
      setTwoFactorError(err instanceof Error ? err.message : "Failed to enable 2FA")
    }
  }

  const handleVerifyTwoFactor = async (e: React.FormEvent) => {
    e.preventDefault()
    setTwoFactorError("")

    try {
      await verifyAndEnableTwoFactor(twoFactorCode)
      setShowTwoFactorSetup(false)
      setTwoFactorCode("")
      setQrCodeUrl("")
    } catch (err) {
      setTwoFactorError(err instanceof Error ? err.message : "Invalid verification code")
    }
  }

  const handleDisableTwoFactor = async () => {
    const code = prompt("Enter your verification code to disable 2FA:")
    if (!code) return

    try {
      await disableTwoFactor(code)
      setTwoFactorError("")
    } catch (err) {
      setTwoFactorError(err instanceof Error ? err.message : "Failed to disable 2FA")
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground text-balance">Settings</h2>
          <p className="text-muted-foreground mt-1">Manage your preferences and integrations</p>
        </div>

        {/* Profile Section */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-2xl font-bold text-primary">
                {user?.firstName
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "U"}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{user?.firstName || "User"}</h3>
                <p className="text-sm text-muted-foreground">{user?.email || "No email"}</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={user?.firstName || ""} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue={user?.email || ""} className="mt-1" />
              </div>
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Update Profile</Button>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              <CardTitle>Change Password</CardTitle>
            </div>
            <CardDescription>Update your password to keep your account secure</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              {passwordError && (
                <div className="flex gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <p>{passwordError}</p>
                </div>
              )}

              {passwordSuccess && (
                <div className="flex gap-2 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <p>Password changed successfully!</p>
                </div>
              )}

              <Button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? "Changing..." : "Change Password"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Two-Factor Authentication</CardTitle>
            </div>
            <CardDescription>Add an extra layer of security to your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <h4 className="font-medium text-foreground">Two-Factor Authentication</h4>
                <p className="text-sm text-muted-foreground">
                  {requiresTwoFactor
                    ? "Your account is protected with 2FA"
                    : "Secure your account with authenticator app"}
                </p>
              </div>
              <div>
                {requiresTwoFactor ? (
                  <Button variant="destructive" onClick={handleDisableTwoFactor} disabled={loading}>
                    Disable
                  </Button>
                ) : (
                  <Button onClick={handleEnableTwoFactor} disabled={loading}>
                    Enable
                  </Button>
                )}
              </div>
            </div>

            {twoFactorError && (
              <div className="flex gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <p>{twoFactorError}</p>
              </div>
            )}

            {showTwoFactorSetup && (
              <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/30">
                <div>
                  <h4 className="font-medium mb-2">Setup Two-Factor Authentication</h4>
                  <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                    <li>Install an authenticator app (Google Authenticator, Authy, etc.)</li>
                    <li>Scan the QR code below with your authenticator app</li>
                    <li>Enter the 6-digit code from your app to verify</li>
                  </ol>
                </div>

                <div className="flex justify-center p-4 bg-white rounded-lg">
                  <div className="text-center">
                    <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-muted-foreground">
                      QR Code Placeholder
                      <br />
                      {qrCodeUrl && <span className="text-[10px] break-all">{qrCodeUrl}</span>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Demo: Use code 123456</p>
                  </div>
                </div>

                <form onSubmit={handleVerifyTwoFactor} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="verificationCode">Verification Code</Label>
                    <Input
                      id="verificationCode"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value)}
                      maxLength={6}
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowTwoFactorSetup(false)
                        setTwoFactorCode("")
                        setQrCodeUrl("")
                      }}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Verifying..." : "Verify & Enable"}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Settings */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>AI Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="summarization">Summarization Level</Label>
              <Select value={summarization} onValueChange={setSummarization}>
                <SelectTrigger id="summarization" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short</SelectItem>
                  <SelectItem value="detailed">Detailed</SelectItem>
                  <SelectItem value="comprehensive">Comprehensive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Integrations */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Integrations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <h4 className="font-medium text-foreground">Google Calendar</h4>
                <p className="text-sm text-muted-foreground">Sync your meetings with Google Calendar</p>
              </div>
              <Switch checked={syncGoogle} onCheckedChange={setSyncGoogle} />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <h4 className="font-medium text-foreground">Microsoft Teams</h4>
                <p className="text-sm text-muted-foreground">Connect your Teams workspace</p>
              </div>
              <Switch checked={syncTeams} onCheckedChange={setSyncTeams} />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <h4 className="font-medium text-foreground">Zoom</h4>
                <p className="text-sm text-muted-foreground">Link your Zoom account</p>
              </div>
              <Switch checked={syncZoom} onCheckedChange={setSyncZoom} />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <h4 className="font-medium text-foreground">ERP Sync</h4>
                <p className="text-sm text-muted-foreground">Synchronize with your ERP system</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
