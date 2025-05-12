"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useCloudProviders, useCloudProviderCredential } from "@/hooks/use-cloud-providers"
import { CloudProviderForm } from "./cloud-provider-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, ArrowLeft, RefreshCcw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ClientProviderFormProps {
  credentialId?: string
}

export function ClientProviderForm({ credentialId }: ClientProviderFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  // Fetch cloud providers
  const {
    data: providers,
    isLoading: isLoadingProviders,
    error: providersError,
    refetch: refetchProviders,
  } = useCloudProviders()

  // Fetch credential if editing
  const {
    data: credential,
    isLoading: isLoadingCredential,
    error: credentialError,
    refetch: refetchCredential,
  } = useCloudProviderCredential(credentialId)

  // Handle errors
  useEffect(() => {
    if (providersError) {
      const errorMessage =
        providersError instanceof Error ? providersError.message : "Failed to load cloud providers. Please try again."

      setError(errorMessage)
      console.error("Providers error:", providersError)
    } else if (credentialId && credentialError) {
      const errorMessage =
        credentialError instanceof Error
          ? credentialError.message
          : "Failed to load credential details. Please try again."

      setError(errorMessage)
      console.error("Credential error:", credentialError)
    } else {
      setError(null)
    }
  }, [providersError, credentialError, credentialId])

  // Handle retry
  const handleRetry = () => {
    refetchProviders()
    if (credentialId) {
      refetchCredential()
    }
  }

  // Handle success
  const handleSuccess = () => {
    router.push("/cloud-providers")
  }

  // Show loading state
  if (isLoadingProviders || (credentialId && isLoadingCredential)) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-2/3" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-32" />
        </CardFooter>
      </Card>
    )
  }

  // Show error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{credentialId ? "Edit" : "Add"} Cloud Provider</CardTitle>
          <CardDescription>
            {credentialId
              ? "Update your cloud provider credentials"
              : "Connect your cloud provider to manage your infrastructure"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>

          <p className="text-sm text-muted-foreground mb-4">
            This could be because the cloud provider tables haven't been created in your database yet. Please make sure
            you've run the SQL migration script.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={() => router.push("/cloud-providers")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={handleRetry}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // Show empty state if no providers
  if (!providers || providers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Cloud Providers Available</CardTitle>
          <CardDescription>There are currently no cloud providers configured in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Please make sure you've run the SQL migration script to create the cloud provider tables and sample data.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={() => router.push("/cloud-providers")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={handleRetry}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // Show form
  return <CloudProviderForm providers={providers} credential={credential} onSuccess={handleSuccess} />
}
