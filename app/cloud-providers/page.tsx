import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { PageHeader } from "@/components/ui/page-header"
import { CloudProvidersList } from "@/components/cloud-providers/cloud-providers-list"
import { Skeleton } from "@/components/ui/skeleton"
import { PlusCircle } from "lucide-react"

export default function CloudProvidersPage() {
  return (
    <DashboardLayout>
      <PageHeader
        heading="Cloud Providers"
        subheading="Manage your cloud provider credentials"
        actions={
          <Link href="/cloud-providers/add">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Provider
            </Button>
          </Link>
        }
      />
      <div className="container mx-auto py-6">
        <Suspense fallback={<CloudProvidersListSkeleton />}>
          <CloudProvidersList />
        </Suspense>
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
      <Skeleton className="h-20 w-full" />
    </div>
  )
}
