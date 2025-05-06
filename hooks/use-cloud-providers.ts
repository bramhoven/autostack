"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getCloudProviders,
  getUserCloudProviderCredentials,
  getCloudProviderCredentialById,
  createCloudProviderCredential,
  updateCloudProviderCredential,
  deleteCloudProviderCredential,
} from "@/lib/actions/cloud-providers"
import { useToast } from "@/components/ui/use-toast"

export function useCloudProviders() {
  const {
    data: providers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cloud-providers"],
    queryFn: getCloudProviders,
  })

  return {
    providers,
    isLoading,
    error,
  }
}

export function useCloudProviderCredentials() {
  const {
    data: credentials,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cloud-provider-credentials"],
    queryFn: getUserCloudProviderCredentials,
  })

  return {
    credentials,
    isLoading,
    error,
  }
}

export function useCloudProviderCredential(id: string) {
  const {
    data: credential,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cloud-provider-credential", id],
    queryFn: () => getCloudProviderCredentialById(id),
    enabled: !!id,
  })

  return {
    credential,
    isLoading,
    error,
  }
}

export function useCreateCloudProviderCredential() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      providerId,
      name,
      credentials,
      isDefault,
    }: {
      providerId: number
      name: string
      credentials: Record<string, any>
      isDefault?: boolean
    }) => createCloudProviderCredential(providerId, name, credentials, isDefault),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cloud-provider-credentials"] })
      toast({
        title: "Success",
        description: "Cloud provider credential created successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create cloud provider credential",
        variant: "destructive",
      })
    },
  })

  return {
    createCredential: mutate,
    isCreating: isPending,
  }
}

export function useUpdateCloudProviderCredential() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string
      updates: {
        name?: string
        credentials?: Record<string, any>
        is_default?: boolean
      }
    }) => updateCloudProviderCredential(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cloud-provider-credentials"] })
      queryClient.invalidateQueries({ queryKey: ["cloud-provider-credential", variables.id] })
      toast({
        title: "Success",
        description: "Cloud provider credential updated successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update cloud provider credential",
        variant: "destructive",
      })
    },
  })

  return {
    updateCredential: mutate,
    isUpdating: isPending,
  }
}

export function useDeleteCloudProviderCredential() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => deleteCloudProviderCredential(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cloud-provider-credentials"] })
      toast({
        title: "Success",
        description: "Cloud provider credential deleted successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete cloud provider credential",
        variant: "destructive",
      })
    },
  })

  return {
    deleteCredential: mutate,
    isDeleting: isPending,
  }
}
