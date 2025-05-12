import { Suspense } from "react"
import { ClientProviderForm } from "@/components/cloud-providers/client-provider-form"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { PageHeader } from "@/components/ui/page-header"

export default function EditCloudProviderPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <PageHeader heading="Edit Cloud Provider Credential" subheading="Update your cloud provider credentials" />
      <div className="container mx-auto py-6">
        <Suspense fallback={<ProviderFormSkeleton />}>
          <ClientProviderForm credentialId={params.id} />
        </Suspense>
      </div>
    </DashboardLayout>
  )
}

function ProviderFormSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-full max-w-sm" />
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-2/3" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>
  )
}
