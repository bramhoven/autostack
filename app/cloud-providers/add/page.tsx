import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Suspense } from "react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { CloudProviderForm } from "@/components/cloud-providers/cloud-provider-form"

export default function AddCloudProviderPage() {
  return (
    <DashboardLayout>
      <div className="container py-8">
        <div className="mb-8">
          <Link
            href="/cloud-providers"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Cloud Providers
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Add Cloud Provider</h1>
          <p className="text-muted-foreground">Configure your cloud provider credentials</p>
        </div>

        <div className="max-w-2xl">
          <Suspense fallback={<div className="p-8 text-center">Loading form...</div>}>
            <CloudProviderForm />
          </Suspense>
        </div>
      </div>
    </DashboardLayout>
  )
}
