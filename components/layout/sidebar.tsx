"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAppSelector } from "@/lib/store/hooks"
import { selectAuthUser } from "@/lib/store/auth/authSelectors"
import {
  Home,
  Calendar,
  CheckSquare,
  BarChart3,
  Settings,
  X,
  AlertCircle,
  Target,
  Lightbulb,
  FileText,
  ClipboardList,
  Shield,
} from "lucide-react"
import Image from "next/image"

interface SidebarProps {
  open: boolean
  onToggle: () => void
}

export default function Sidebar({ open, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const user = useAppSelector(selectAuthUser)

  const isAdmin = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN"

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Calendar, label: "Meetings", href: "/meetings" },
    { icon: CheckSquare, label: "My Actions", href: "/actions" },
    { icon: AlertCircle, label: "Concerns", href: "/concerns" },
    { icon: Target, label: "Business Goals", href: "/business-goals" },
    { icon: Lightbulb, label: "Suggestions", href: "/suggestions" },
    { icon: FileText, label: "Transcripts", href: "/transcripts" },
    { icon: ClipboardList, label: "Reports", href: "/meeting-reports" },
    { icon: BarChart3, label: "Analytics", href: "/analytics" },
    ...(isAdmin ? [{ icon: Shield, label: "Admin", href: "/admin" }] : []),
    { icon: Settings, label: "Settings", href: "/settings" },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onToggle} />}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex w-64 transform flex-col border-r border-border bg-sidebar transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Close button on mobile */}
        <div className="flex items-center justify-between border-b border-border p-4 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              B+
            </div>
            <span className="text-lg font-bold text-foreground">
              <Image
                className="items-center"
                src="/logo_bacs+2.png"
                alt="BACS+"
                width={150}
                height={10}
                priority
              />
            </span>
          </div>
          <button onClick={onToggle} className="text-foreground hover:bg-secondary rounded p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Logo on desktop */}
        <div className="hidden items-center gap-2 border-b border-border p-4 lg:flex">

          <span className="text-lg font-bold text-foreground">
            <Image
              className="items-center"
              src="/logo_bacs+2.png"
              alt="BACS+"
              width={200}
              height={15}
              priority
            />
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${isActive ? "bg-primary text-primary-foreground" : "text-sidebar-foreground hover:bg-secondary"
                    }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-2 rounded-lg px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary font-semibold">
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </div>
            <div className="text-sm">
              <p className="font-medium text-foreground">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
