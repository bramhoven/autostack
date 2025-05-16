"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCloudProviderCredentials, useDeleteCloudProviderCredential } from "@/hooks/use-cloud-providers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Edit, Loader2, MoreHorizontal, Plus, Trash } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function CloudProvidersList() {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Fetch cloud provider credentials
  const { data: credentials, isLoading, error, refetch } = useCloudProviderCredentials()

  // Delete mutation
  const { mutate: deleteCredential, isPending: isDeleting } = useDeleteCloudProviderCredential()

  // Handle delete
  const handleDelete = () => {
    if (deleteId) {
      deleteCredential(deleteId, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false)
          setDeleteId(null)
        },
      })
    }
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  // Show error state
  if (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to load cloud provider credentials"

    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Credentials</CardTitle>
          <CardDescription>There was a problem loading your cloud provider credentials.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
          <p className="mt-4 text-sm text-muted-foreground mb-4">
            This could be because the cloud provider tables haven't been created in your database yet. Please make sure
            you've run the SQL migration script.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={() => refetch()}>Try Again</Button>
          <Link href="/cloud-providers/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Provider
            </Button>
          </Link>
        </CardFooter>
      </Card>
    )
  }

  // Show empty state
  if (!credentials || credentials.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Cloud Provider Credentials</CardTitle>
          <CardDescription>You haven't added any cloud provider credentials yet.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Add your cloud provider credentials to start managing your cloud infrastructure.
          </p>
          <Link href="/cloud-providers/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Provider
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  // Show credentials list
  return (
    <div>
      <div className="flex justify-end mb-4">
        <Link href="/cloud-providers/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Provider
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {credentials.map((credential) => (
          <Card key={credential.id}>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>{credential.name}</CardTitle>
                <CardDescription>
                  {credential.cloud_providers?.name || "Unknown Provider"}
                  {credential.is_default && " (Default)"}
                </CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push(`/cloud-providers/edit/${credential.id}`)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => {
                      setDeleteId(credential.id)
                      setIsDeleteDialogOpen(true)
                    }}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <p>
                  <strong>Provider:</strong> {credential.cloud_providers?.name || "Unknown"}
                </p>
                {credential.cloud_providers?.slug === "aws" && credential.credentials && (
                  <p>
                    <strong>Region:</strong> {credential.credentials.aws_region || "N/A"}
                  </p>
                )}
                <p>
                  <strong>Added:</strong> {new Date(credential.created_at).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" onClick={() => router.push(`/cloud-providers/edit/${credential.id}`)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Cloud Provider Credential</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this cloud provider credential? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
