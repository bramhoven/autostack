import { Suspense } from "react"
import { ClientProviderForm } from "@/components/cloud-providers/client-provider-form"
import { Skeleton } from "@/components/ui/skeleton"

export default function AddCloudProviderPage() {
  // Get the provider type from the query string if available
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Add Cloud Provider Credential</h1>
      <Suspense fallback={<ProviderFormSkeleton />}>
        <ClientProviderForm />
      </Suspense>
    </div>
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
