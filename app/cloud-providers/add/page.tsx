import { Suspense } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { ClientProviderForm } from "@/components/cloud-providers/client-provider-form"
import { Skeleton } from "@/components/ui/skeleton"

export default function AddCloudProviderPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <PageHeader
        heading="Add Cloud Provider"
        subheading="Connect your cloud provider to manage your infrastructure"
        backButton={{ href: "/cloud-providers", label: "Back to Cloud Providers" }}
      />

      <Suspense
        fallback={
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
        }
      >
        <ClientProviderForm />
      </Suspense>
    </div>
  )
}
