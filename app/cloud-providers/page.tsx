import Link from "next/link"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { CloudProvidersList } from "@/components/cloud-providers/cloud-providers-list"
import { Plus } from "lucide-react"

export default function CloudProvidersPage() {
  return (
    <DashboardLayout>
      <div className="container py-8">
        <PageHeader
          heading="Cloud Providers"
          subheading="Manage your cloud provider credentials"
          actions={
            <Link href="/cloud-providers/add">
              <Button className="gap-1.5">
                <Plus className="h-4 w-4" />
                Add Credentials
              </Button>
            </Link>
          }
        />

        <CloudProvidersList />
      </div>
    </DashboardLayout>
  )
}
