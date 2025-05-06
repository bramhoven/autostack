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
import type { Database } from "@/lib/supabase/database.types"

type CloudProvider = Database["public"]["Tables"]["cloud_providers"]["Row"]
type CloudProviderCredential = Database["public"]["Tables"]["cloud_provider_credentials"]["Row"]

// Hook to fetch all cloud providers
export function useCloudProviders() {
  return useQuery({
    queryKey: ["cloudProviders"],
    queryFn: getCloudProviders,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Hook to fetch all cloud provider credentials for the current user
export function useCloudProviderCredentials() {
  return useQuery({
    queryKey: ["cloudProviderCredentials"],
    queryFn: getCloudProviderCredentials,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Hook to fetch a specific cloud provider credential
export function useCloudProviderCredential(id?: string, options = {}) {
  return useQuery({
    queryKey: ["cloudProviderCredential", id],
    queryFn: () => (id ? getCloudProviderCredential(id) : null),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  })
}

// Hook to create a new cloud provider credential
export function useCreateCloudProviderCredential() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCloudProviderCredential,
    onSuccess: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["cloudProviderCredentials"] })
    },
  })
}

// Hook to update an existing cloud provider credential
export function useUpdateCloudProviderCredential() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateCloudProviderCredential,
    onSuccess: (data) => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["cloudProviderCredentials"] })
      queryClient.invalidateQueries({ queryKey: ["cloudProviderCredential", data.id] })
    },
  })
}

// Hook to delete a cloud provider credential
export function useDeleteCloudProviderCredential() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCloudProviderCredential,
    onSuccess: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["cloudProviderCredentials"] })
    },
  })
}
