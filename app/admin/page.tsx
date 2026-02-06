"use client"

import { useState } from "react"
import { useAdmin } from "@/lib/hooks/use-admin"
import { useToast } from "@/hooks/use-toast"
import { AddOrganizationModal } from "@/components/modals/add-organization-modal"
import { AddUserModal } from "@/components/modals/add-user-modal"
import { WorkspaceSettingsModal } from "@/components/modals/workspace-settings-modal"
import { Button } from "@/components/ui/button"
import {
  Building2,
  Users,
  Boxes,
  History as LogHistory,
  Plus,
  Edit2,
  Trash2,
  Shield,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { useAppSelector } from "@/lib/store/hooks"

export default function AdminPage() {
  const { toast } = useToast()
  const {
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
    deleteWorkspace,
  } = useAdmin()
  const [activeTab, setActiveTab] = useState<"organizations" | "users" | "workspaces" | "audit">("organizations")
  const [showAddOrgModal, setShowAddOrgModal] = useState(false)
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [showAddWorkspaceModal, setShowAddWorkspaceModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { user, requiresTwoFactor, loading } = useAppSelector(s => s.auth)

  const isAdmin = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN"

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You do not have permission to access the admin panel.</p>
        </div>
      </div>
    )
  }

  const handleAddOrganization = (formData: any) => {
    addOrganization(formData)
    setShowAddOrgModal(false)
    toast({
      title: "Success",
      description: "Organization created successfully",
    })
  }

  const handleAddUser = (formData: any) => {
    addUser(formData)
    setShowAddUserModal(false)
    toast({
      title: "Success",
      description: "User created successfully",
    })
  }

  const handleAddWorkspace = (formData: any) => {
    addWorkspace(formData)
    setShowAddWorkspaceModal(false)
    toast({
      title: "Success",
      description: "Workspace created successfully",
    })
  }

  const handleDeleteOrganization = (id: number) => {
    deleteOrganization(id)
    toast({
      title: "Deleted",
      description: "Organization deleted successfully",
    })
  }

  const handleDeleteUser = (id: number) => {
    deleteUser(id)
    toast({
      title: "Deleted",
      description: "User deleted successfully",
    })
  }

  const handleDeleteWorkspace = (id: number) => {
    deleteWorkspace(id)
    toast({
      title: "Deleted",
      description: "Workspace deleted successfully",
    })
  }

  return (
    <div className="min-h-screen bg-background p-8">
      {showAddOrgModal && (
        <AddOrganizationModal onClose={() => setShowAddOrgModal(false)} onSubmit={handleAddOrganization} />
      )}
      {showAddUserModal && <AddUserModal onClose={() => setShowAddUserModal(false)} onSubmit={handleAddUser} />}
      {showAddWorkspaceModal && (
        <WorkspaceSettingsModal onClose={() => setShowAddWorkspaceModal(false)} onSubmit={handleAddWorkspace} />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Administration</h1>
          <p className="text-muted-foreground">Manage organizations, users, workspaces, and system settings</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab("organizations")}
            className={`flex items-center gap-2 px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === "organizations"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
          >
            <Building2 className="h-4 w-4" />
            Organizations
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === "users"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
          >
            <Users className="h-4 w-4" />
            Users
          </button>
          <button
            onClick={() => setActiveTab("workspaces")}
            className={`flex items-center gap-2 px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === "workspaces"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
          >
            <Boxes className="h-4 w-4" />
            Workspaces
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`flex items-center gap-2 px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === "audit"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
          >
            <LogHistory className="h-4 w-4" />
            Audit Logs
          </button>
        </div>

        {/* Organizations Tab */}
        {activeTab === "organizations" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search organizations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button onClick={() => setShowAddOrgModal(true)} className="ml-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Organization
              </Button>
            </div>

            <div className="grid gap-4">
              {organizations.map((org) => (
                <div
                  key={org.id}
                  className="border border-border rounded-lg p-4 bg-card hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground">{org.name}</h3>
                      <p className="text-sm text-muted-foreground">{org.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${org.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                      >
                        {org.status}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        {org.plan}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{org.memberCount} members</span>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteOrganization(org.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button onClick={() => setShowAddUserModal(true)} className="ml-4">
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-secondary/50">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-foreground">Name</th>
                    <th className="text-left px-4 py-3 font-medium text-foreground">Email</th>
                    <th className="text-left px-4 py-3 font-medium text-foreground">Role</th>
                    <th className="text-left px-4 py-3 font-medium text-foreground">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-border hover:bg-secondary/50">
                      <td className="px-4 py-3 text-foreground">{`${user.firstName} ${user.lastName}`}</td>
                      <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {user.status === "ACTIVE" ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-green-600">Active</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-red-600" />
                              <span className="text-red-600">Inactive</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(user.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Workspaces Tab */}
        {activeTab === "workspaces" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search workspaces..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button onClick={() => setShowAddWorkspaceModal(true)} className="ml-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Workspace
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {workspaces.map((ws) => (
                <div
                  key={ws.id}
                  className="border border-border rounded-lg p-4 bg-card hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground">{ws.name}</h3>
                      <p className="text-sm text-muted-foreground">{ws.description}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${ws.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                    >
                      {ws.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{ws.memberCount} members</span>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteWorkspace(ws.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Audit Logs Tab */}
        {activeTab === "audit" && (
          <div>
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search audit logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-3">
              {auditLogs.map((log) => (
                <div key={log.id} className="border border-border rounded-lg p-4 bg-card">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">{log.action.replace(/_/g, " ")}</span>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${log.status === "SUCCESS" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                        >
                          {log.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{log.details}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>By: {log.performedBy}</span>
                    <span>{log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
