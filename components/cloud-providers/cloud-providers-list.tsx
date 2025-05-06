"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useCloudProviderCredentials } from "@/hooks/use-cloud-providers"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmptyState } from "@/components/ui/empty-state"
import { Skeleton } from "@/components/ui/skeleton"
import { Edit, Trash2, Server, Plus, CloudIcon } from "lucide-react"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useDeleteCloudProviderCredential } from "@/hooks/use-cloud-providers"
import { useRouter } from "next/navigation"

export function CloudProvidersList() {
  const router = useRouter()
  const { credentials, isLoading } = useCloudProviderCredentials()
  const { deleteCredential, isDeleting } = useDeleteCloudProviderCredential()
  const [credentialToDelete, setCredentialToDelete] = useState<string | null>(null)

  // Group credentials by provider
  const groupedCredentials =
    credentials?.reduce(
      (acc, credential) => {
        const providerSlug = credential.cloud_providers?.slug || "other"
        if (!acc[providerSlug]) {
          acc[providerSlug] = []
        }
        acc[providerSlug].push(credential)
        return acc
      },
      {} as Record<string, typeof credentials>,
    ) || {}

  // Get unique provider slugs
  const providerSlugs = Object.keys(groupedCredentials)

  const handleDelete = async () => {
    if (credentialToDelete) {
      await deleteCredential(credentialToDelete)
      setCredentialToDelete(null)
    }
  }

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="border-primary/10 shadow-md">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-20" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (!credentials || credentials.length === 0) {
    return (
      <EmptyState
        icon={<CloudIcon className="h-12 w-12" />}
        title="No cloud provider credentials"
        description="Add your first cloud provider credentials to start creating servers"
        action={
          <Link href="/cloud-providers/add">
            <Button className="gap-1.5">
              <Plus className="h-4 w-4" />
              Add Credentials
            </Button>
          </Link>
        }
      />
    )
  }

  return (
    <>
      <Tabs defaultValue={providerSlugs[0] || "all"} className="space-y-6">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Providers</TabsTrigger>
          {providerSlugs.map((slug) => (
            <TabsTrigger key={slug} value={slug} className="capitalize">
              {slug.replace("-", " ")}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {credentials.map((credential) => (
              <Card key={credential.id} className="border-primary/10 shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {credential.cloud_providers?.logo_url ? (
                        <div className="h-8 w-8 overflow-hidden rounded-md">
                          <Image
                            src={credential.cloud_providers.logo_url || "/placeholder.svg"}
                            alt={credential.cloud_providers.name}
                            width={32}
                            height={32}
                            className="h-full w-full object-contain"
                          />
                        </div>
                      ) : (
                        <CloudIcon className="h-8 w-8" />
                      )}
                      <CardTitle className="text-lg">{credential.name}</CardTitle>
                    </div>
                    {credential.is_default && (
                      <Badge variant="outline" className="bg-primary/10 text-xs">
                        Default
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{credential.cloud_providers?.name || "Cloud Provider"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Added on {new Date(credential.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => router.push(`/servers/add?provider=${credential.id}`)}
                  >
                    <Server className="h-4 w-4" />
                    Create Server
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 p-0"
                      onClick={() => router.push(`/cloud-providers/edit/${credential.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 p-0 text-destructive hover:text-destructive"
                      onClick={() => setCredentialToDelete(credential.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {providerSlugs.map((slug) => (
          <TabsContent key={slug} value={slug} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {groupedCredentials[slug]?.map((credential) => (
                <Card key={credential.id} className="border-primary/10 shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {credential.cloud_providers?.logo_url ? (
                          <div className="h-8 w-8 overflow-hidden rounded-md">
                            <Image
                              src={credential.cloud_providers.logo_url || "/placeholder.svg"}
                              alt={credential.cloud_providers.name}
                              width={32}
                              height={32}
                              className="h-full w-full object-contain"
                            />
                          </div>
                        ) : (
                          <CloudIcon className="h-8 w-8" />
                        )}
                        <CardTitle className="text-lg">{credential.name}</CardTitle>
                      </div>
                      {credential.is_default && (
                        <Badge variant="outline" className="bg-primary/10 text-xs">
                          Default
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{credential.cloud_providers?.name || "Cloud Provider"}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      Added on {new Date(credential.created_at).toLocaleDateString()}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      onClick={() => router.push(`/servers/add?provider=${credential.id}`)}
                    >
                      <Server className="h-4 w-4" />
                      Create Server
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0"
                        onClick={() => router.push(`/cloud-providers/edit/${credential.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 text-destructive hover:text-destructive"
                        onClick={() => setCredentialToDelete(credential.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <ConfirmDialog
        open={!!credentialToDelete}
        onOpenChange={() => setCredentialToDelete(null)}
        title="Delete Cloud Provider Credential"
        description="Are you sure you want to delete this cloud provider credential? This action cannot be undone."
        onConfirm={handleDelete}
        loading={isDeleting}
      />
    </>
  )
}
