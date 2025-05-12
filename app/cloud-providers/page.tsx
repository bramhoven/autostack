import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CloudProvidersList } from "@/components/cloud-providers/cloud-providers-list"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { PageHeader } from "@/components/ui/page-header"
import { Skeleton } from "@/components/ui/skeleton"

export default function CloudProvidersPage() {
  return (
    <DashboardLayout>
      <div className="container py-6">
        <PageHeader
          heading="Cloud Providers"
          subheading="Manage your cloud provider credentials"
          actions={
            <Link href="/cloud-providers/add">
              <Button>Add Provider</Button>
            </Link>
          }
        />
        <div className="mt-6">
          <Suspense fallback={<CloudProvidersListSkeleton />}>
            <CloudProvidersList />
          </Suspense>
        </div>
      </div>
    </DashboardLayout>
  )
}

function CloudProvidersListSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
  )
}
