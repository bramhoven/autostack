"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getCloudProviders,
  getCloudProviderCredentials,
  getCloudProviderCredential,
  createCloudProviderCredential,
  updateCloudProviderCredential,
  deleteCloudProviderCredential,
} from "@/lib/actions/cloud-providers"
import { useToast } from "@/components/ui/use-toast"

// Hook to fetch all cloud providers
export function useCloudProviders() {
  return useQuery({
    queryKey: ["cloudProviders"],
    queryFn: getCloudProviders,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  })
}

// Hook to fetch all cloud provider credentials for the current user
export function useCloudProviderCredentials() {
  return useQuery({
    queryKey: ["cloudProviderCredentials"],
    queryFn: getCloudProviderCredentials,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  })
}

// Hook to fetch a specific cloud provider credential
export function useCloudProviderCredential(id?: string) {
  return useQuery({
    queryKey: ["cloudProviderCredential", id],
    queryFn: () => (id ? getCloudProviderCredential(id) : null),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  })
}

// Hook to create a new cloud provider credential
export function useCreateCloudProviderCredential() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (params: {
      providerId: number
      name: string
      credentials: Record<string, any>
      isDefault?: boolean
    }) => {
      try {
        const result = await createCloudProviderCredential(
          params.providerId,
          params.name,
          params.credentials,
          params.isDefault,
        )
        return result
      } catch (error) {
        console.error("Error in createCloudProviderCredential mutation:", error)
        throw error
      }
    },
    onSuccess: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["cloudProviderCredentials"] })
    },
    onError: (error: Error) => {
      console.error("Error creating cloud provider credential:", error)
    },
  })
}

// Hook to update an existing cloud provider credential
export function useUpdateCloudProviderCredential() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (params: {
      id: string
      updates: {
        name?: string
        credentials?: Record<string, any>
        is_default?: boolean
      }
    }) => {
      try {
        const result = await updateCloudProviderCredential(params.id, params.updates)
        return result
      } catch (error) {
        console.error("Error in updateCloudProviderCredential mutation:", error)
        throw error
      }
    },
    onSuccess: (_, variables) => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["cloudProviderCredentials"] })
      queryClient.invalidateQueries({ queryKey: ["cloudProviderCredential", variables.id] })
    },
    onError: (error: Error) => {
      console.error("Error updating cloud provider credential:", error)
    },
  })
}

// Hook to delete a cloud provider credential
export function useDeleteCloudProviderCredential() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const result = await deleteCloudProviderCredential(id)
        return result
      } catch (error) {
        console.error("Error in deleteCloudProviderCredential mutation:", error)
        throw error
      }
    },
    onSuccess: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["cloudProviderCredentials"] })
    },
    onError: (error: Error) => {
      console.error("Error deleting cloud provider credential:", error)
    },
  })
}
