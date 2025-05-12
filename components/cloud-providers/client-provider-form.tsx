"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CloudProviderForm } from "./cloud-provider-form"
import { useCloudProviders, useCloudProviderCredential } from "@/hooks/use-cloud-providers"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface ClientProviderFormProps {
  credentialId?: string
}

export function ClientProviderForm({ credentialId }: ClientProviderFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultProviderId = searchParams.get("provider") || undefined
  const [error, setError] = useState<string | null>(null)

  // Fetch cloud providers
  const { data: providers, isLoading: isLoadingProviders, error: providersError } = useCloudProviders()

  // Fetch credential if editing
  const {
    data: credential,
    isLoading: isLoadingCredential,
    error: credentialError,
  } = useCloudProviderCredential(credentialId)

  // Handle loading states
  const isLoading = isLoadingProviders || (credentialId && isLoadingCredential)

  // Handle errors
  useEffect(() => {
    if (providersError) {
      setError(providersError.message || "Failed to load cloud providers")
    } else if (credentialId && credentialError) {
      setError(credentialError.message || "Failed to load cloud provider credential")
    } else {
      setError(null)
    }
  }, [providersError, credentialError, credentialId])

  // Handle success
  const handleSuccess = () => {
    router.push("/cloud-providers")
  }

  if (isLoading) {
    return <ProviderFormSkeleton />
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  // Safety check for providers
  if (!providers || providers.length === 0) {
    return (
      <Alert variant="warning">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Cloud Providers Available</AlertTitle>
        <AlertDescription>
          No cloud providers are currently available. Please try again later or contact support.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <CloudProviderForm
      providers={providers}
      credential={credential}
      defaultProviderId={defaultProviderId}
      onSuccess={handleSuccess}
    />
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
