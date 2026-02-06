import DashboardLayout from "@/components/layout/dashboard-layout"
import DashboardPage from "@/components/pages/dashboard-page"

export const metadata = {
  title: "Dashboard - BACS+ Meeting Management",
  description: "Your meeting management dashboard",
}

export default function Dashboard() {
  return (
    <DashboardLayout>
      <DashboardPage />
    </DashboardLayout>
  )
}
