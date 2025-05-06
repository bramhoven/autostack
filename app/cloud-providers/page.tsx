import { Suspense } from "react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { CloudProvidersList } from "@/components/cloud-providers/cloud-providers-list"
import { PageHeader } from "@/components/ui/page-header"

export default function CloudProvidersPage() {
  return (
    <DashboardLayout>
      <div className="container py-8">
        <PageHeader
          title="Cloud Providers"
          description="Manage your cloud provider credentials"
          action={{ label: "Add Provider", href: "/cloud-providers/add" }}
        />

        <Suspense fallback={<div className="p-8 text-center">Loading cloud providers...</div>}>
          <CloudProvidersList />
        </Suspense>
      </div>
    </DashboardLayout>
  )
}
