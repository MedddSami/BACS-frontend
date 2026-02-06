"use client"

import { useState, useCallback } from "react"

export interface Organization {
  id: number
  name: string
  description: string
  createdAt: string
  memberCount: number
  status: "ACTIVE" | "INACTIVE"
  plan: "FREE" | "PREMIUM" | "ENTERPRISE"
}

export interface AdminUser {
  id: number
  email: string
  firstName: string
  lastName: string
  organizationId: number
  role: "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "EMPLOYEE" | "GUEST"
  status: "ACTIVE" | "INACTIVE"
  createdAt: string
  lastLogin?: string
}

export interface Workspace {
  id: number
  name: string
  organizationId: number
  description: string
  memberCount: number
  createdAt: string
  status: "ACTIVE" | "INACTIVE"
}

export interface AuditLog {
  id: number
  action: string
  performedBy: string
  targetType: "USER" | "ORGANIZATION" | "WORKSPACE"
  targetId: number
  timestamp: string
  details: string
  status: "SUCCESS" | "FAILED"
}

const mockOrganizations: Organization[] = [
  {
    id: 1,
    name: "Acme Corporation",
    description: "Leading technology company focused on innovation",
    createdAt: "2024-01-15",
    memberCount: 45,
    status: "ACTIVE",
    plan: "ENTERPRISE",
  },
  {
    id: 2,
    name: "Tech Ventures Inc",
    description: "Startup accelerator and venture capital firm",
    createdAt: "2024-02-20",
    memberCount: 28,
    status: "ACTIVE",
    plan: "PREMIUM",
  },
  {
    id: 3,
    name: "Innovation Labs",
    description: "Research and development organization",
    createdAt: "2024-03-10",
    memberCount: 12,
    status: "ACTIVE",
    plan: "FREE",
  },
]

const mockAdminUsers: AdminUser[] = [
  {
    id: 1,
    email: "admin@acme.com",
    firstName: "John",
    lastName: "Admin",
    organizationId: 1,
    role: "ADMIN",
    status: "ACTIVE",
    createdAt: "2024-01-15",
    lastLogin: "2024-01-08",
  },
  {
    id: 2,
    email: "super@bacs.com",
    firstName: "Sarah",
    lastName: "Super",
    organizationId: 1,
    role: "SUPER_ADMIN",
    status: "ACTIVE",
    createdAt: "2024-01-01",
    lastLogin: "2024-01-08",
  },
  {
    id: 3,
    email: "manager@tech.com",
    firstName: "Mike",
    lastName: "Manager",
    organizationId: 2,
    role: "MANAGER",
    status: "ACTIVE",
    createdAt: "2024-02-20",
    lastLogin: "2024-01-07",
  },
]

const mockWorkspaces: Workspace[] = [
  {
    id: 1,
    name: "Product Development",
    organizationId: 1,
    description: "Main product team workspace",
    memberCount: 15,
    createdAt: "2024-01-15",
    status: "ACTIVE",
  },
  {
    id: 2,
    name: "Marketing Operations",
    organizationId: 1,
    description: "Marketing and communications team",
    memberCount: 8,
    createdAt: "2024-01-20",
    status: "ACTIVE",
  },
]

const mockAuditLogs: AuditLog[] = [
  {
    id: 1,
    action: "USER_CREATED",
    performedBy: "Sarah Super",
    targetType: "USER",
    targetId: 3,
    timestamp: "2024-01-08 14:30:00",
    details: "Created new user: Mike Manager",
    status: "SUCCESS",
  },
  {
    id: 2,
    action: "ORGANIZATION_UPDATED",
    performedBy: "John Admin",
    targetType: "ORGANIZATION",
    targetId: 1,
    timestamp: "2024-01-08 12:15:00",
    details: "Updated organization plan from PREMIUM to ENTERPRISE",
    status: "SUCCESS",
  },
  {
    id: 3,
    action: "USER_ROLE_CHANGED",
    performedBy: "Sarah Super",
    targetType: "USER",
    targetId: 1,
    timestamp: "2024-01-07 10:45:00",
    details: "Changed role from MANAGER to ADMIN",
    status: "SUCCESS",
  },
]

export function useAdmin() {
  const [organizations, setOrganizations] = useState<Organization[]>(mockOrganizations)
  const [users, setUsers] = useState<AdminUser[]>(mockAdminUsers)
  const [workspaces, setWorkspaces] = useState<Workspace[]>(mockWorkspaces)
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs)

  const addOrganization = useCallback(
    (org: Omit<Organization, "id" | "createdAt" | "memberCount">) => {
      const newOrg: Organization = {
        ...org,
        id: Math.max(...organizations.map((o) => o.id), 0) + 1,
        createdAt: new Date().toISOString().split("T")[0],
        memberCount: 0,
      }
      setOrganizations((prev) => [...prev, newOrg])
      return newOrg
    },
    [organizations],
  )

  const updateOrganization = useCallback((id: number, updates: Partial<Organization>) => {
    setOrganizations((prev) => prev.map((org) => (org.id === id ? { ...org, ...updates } : org)))
  }, [])

  const deleteOrganization = useCallback((id: number) => {
    setOrganizations((prev) => prev.filter((org) => org.id !== id))
  }, [])

  const addUser = useCallback(
    (user: Omit<AdminUser, "id" | "createdAt">) => {
      const newUser: AdminUser = {
        ...user,
        id: Math.max(...users.map((u) => u.id), 0) + 1,
        createdAt: new Date().toISOString().split("T")[0],
      }
      setUsers((prev) => [...prev, newUser])
      addAuditLog({
        action: "USER_CREATED",
        targetType: "USER",
        targetId: newUser.id,
        details: `Created new user: ${user.firstName} ${user.lastName}`,
      })
      return newUser
    },
    [users],
  )

  const updateUser = useCallback((id: number, updates: Partial<AdminUser>) => {
    setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, ...updates } : user)))
  }, [])

  const deleteUser = useCallback((id: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== id))
  }, [])

  const addWorkspace = useCallback(
    (workspace: Omit<Workspace, "id" | "createdAt" | "memberCount">) => {
      const newWorkspace: Workspace = {
        ...workspace,
        id: Math.max(...workspaces.map((w) => w.id), 0) + 1,
        createdAt: new Date().toISOString().split("T")[0],
        memberCount: 0,
      }
      setWorkspaces((prev) => [...prev, newWorkspace])
      return newWorkspace
    },
    [workspaces],
  )

  const updateWorkspace = useCallback((id: number, updates: Partial<Workspace>) => {
    setWorkspaces((prev) => prev.map((ws) => (ws.id === id ? { ...ws, ...updates } : ws)))
  }, [])

  const deleteWorkspace = useCallback((id: number) => {
    setWorkspaces((prev) => prev.filter((ws) => ws.id !== id))
  }, [])

  const addAuditLog = useCallback(
    (log: Omit<AuditLog, "id" | "timestamp" | "performedBy" | "status">) => {
      const newLog: AuditLog = {
        ...log,
        id: Math.max(...auditLogs.map((l) => l.id), 0) + 1,
        timestamp: new Date().toLocaleString(),
        performedBy: "Current User",
        status: "SUCCESS",
      }
      setAuditLogs((prev) => [newLog, ...prev])
      return newLog
    },
    [auditLogs],
  )

  return {
    organizations,
    users,
    workspaces,
    auditLogs,
    addOrganization,
    updateOrganization,
    deleteOrganization,
    addUser,
    updateUser,
    deleteUser,
    addWorkspace,
    updateWorkspace,
    deleteWorkspace,
    addAuditLog,
  }
}
