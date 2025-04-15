"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Copy, Edit, Trash, Server, CheckCircle, CircleSlash } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CopyButton } from "@/components/copy-button"

interface InstallationCardProps {
  installation: any
  software: any
  server: any
  onUpdate: (id: number) => void
  onDelete: (id: number) => void
  onToggleStatus: (id: number, status: string) => void
  formatDate: (date: string) => string
  hideServer?: boolean
}

// Dummy functions to simulate API calls
const updateInstallation = async (data: any) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))
  return { success: true, data }
}

const deleteInstallation = async (id: number) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))
  return { success: true, id }
}

const toggleInstallationStatus = async (data: { id: number; status: string }) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))
  return { success: true, data }
}

export function InstallationCard({
  installation,
  software,
  server,
  onUpdate,
  onDelete,
  onToggleStatus,
  formatDate,
  hideServer,
}: InstallationCardProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isPending, setIsPending] = useState(false)

  const { mutate: updateInstallationMutation } = useMutation({
    mutationFn: updateInstallation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["installations"] })
      toast({
        title: "Success",
        description: "Installation updated successfully",
      })
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update installation: ${error.message}`,
      })
    },
  })

  const { mutate: deleteInstallationMutation } = useMutation({
    mutationFn: deleteInstallation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["installations"] })
      toast({
        title: "Success",
        description: "Installation updated successfully",
      })
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete installation: ${error.message}`,
      })
    },
  })

  const { mutate: toggleStatusMutation } = useMutation({
    mutationFn: toggleInstallationStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["installations"] })
      toast({
        title: "Success",
        description: "Installation status updated successfully",
      })
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update installation status: ${error.message}`,
      })
    },
  })

  const handleUpdate = (id: number) => {
    onUpdate(id)
  }

  const handleDelete = (id: number) => {
    onDelete(id)
  }

  const handleToggleStatus = (id: number, status: string) => {
    setIsPending(true)
    toggleStatusMutation(
      { id, status },
      {
        onSettled: () => {
          setIsPending(false)
        },
      },
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{installation.name}</CardTitle>
            <CardDescription>
              {software.name} - {installation.version}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleUpdate(installation.id)}>
                <Edit className="mr-2 h-4 w-4" /> Update
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(installation.id)}>
                <Trash className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                <CopyButton text={JSON.stringify(installation)} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            Created at {formatDate(installation.created_at)}
          </div>
          {!hideServer && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Server className="h-3.5 w-3.5" />
              <span>{server.name}</span>
            </div>
          )}
          <div>
            {installation.status === "active" ? (
              <Badge variant="outline">
                <CheckCircle className="mr-2 h-4 w-4" />
                Active
              </Badge>
            ) : (
              <Badge variant="destructive">
                <CircleSlash className="mr-2 h-4 w-4" />
                Inactive
              </Badge>
            )}
          </div>
          {installation.notes ? (
            <Alert>
              <AlertTitle>Notes</AlertTitle>
              <AlertDescription>{installation.notes}</AlertDescription>
            </Alert>
          ) : null}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {installation.status === "active" ? (
          <Button
            variant="destructive"
            onClick={() => handleToggleStatus(installation.id, "inactive")}
            disabled={isPending}
          >
            Deactivate
          </Button>
        ) : (
          <Button
            variant="secondary"
            onClick={() => handleToggleStatus(installation.id, "active")}
            disabled={isPending}
          >
            Activate
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
