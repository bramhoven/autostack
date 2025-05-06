import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { CloudProviderForm } from "@/components/cloud-providers/cloud-provider-form"

export default function EditCloudProviderPage({ params }: { params: { id: string } }) {
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
          <h1 className="text-3xl font-bold tracking-tight">Edit Cloud Provider Credentials</h1>
          <p className="text-muted-foreground">Update your cloud provider credentials</p>
        </div>

        <CloudProviderForm credentialId={params.id} />
      </div>
    </DashboardLayout>
  )
}
