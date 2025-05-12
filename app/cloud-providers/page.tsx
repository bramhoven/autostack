import Link from "next/link"
import { Suspense } from "react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Button } from "@/components/ui/button"
import { CloudProvidersList } from "@/components/cloud-providers/cloud-providers-list"
import { Plus } from "lucide-react"

export default function CloudProvidersPage() {
  return (
    <DashboardLayout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cloud Providers</h1>
            <p className="text-muted-foreground">Manage your cloud provider credentials</p>
          </div>
          <Link href="/cloud-providers/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Provider
            </Button>
          </Link>
        </div>

        <Suspense fallback={<div className="p-8 text-center">Loading cloud providers...</div>}>
          <CloudProvidersList />
        </Suspense>
      </div>
    </DashboardLayout>
  )
}
