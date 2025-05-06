"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CloudProviderForm } from "./cloud-provider-form"
import { useCloudProviders, useCloudProviderCredential } from "@/hooks/use-cloud-providers"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface ClientProviderFormProps {
  credentialId?: string
  defaultProviderId?: string
}

export function ClientProviderForm({ credentialId, defaultProviderId }: ClientProviderFormProps) {
  const router = useRouter()

  const { data: providers, isLoading: isLoadingProviders, error: providersError } = useCloudProviders()

  const {
    data: credential,
    isLoading: isLoadingCredential,
    error: credentialError,
  } = useCloudProviderCredential(credentialId)

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Set loading state based on data fetching
    setIsLoading(isLoadingProviders || (credentialId ? isLoadingCredential : false))

    // Handle errors
    if (providersError) {
      setError("Failed to load cloud providers. Please try again.")
    } else if (credentialError && credentialId) {
      setError("Failed to load cloud provider details. Please try again.")
    } else {
      setError(null)
    }
  }, [isLoadingProviders, isLoadingCredential, providersError, credentialError, credentialId])

  if (isLoading) {
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

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!providers || providers.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No cloud providers available</AlertTitle>
        <AlertDescription>
          There are no cloud providers configured in the system. Please contact your administrator.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <CloudProviderForm
      providers={providers}
      credential={credential}
      defaultProviderId={defaultProviderId}
      onSuccess={() => router.push("/cloud-providers")}
    />
  )
}
