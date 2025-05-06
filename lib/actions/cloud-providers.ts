"use server"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { encrypt, decrypt } from "@/lib/encryption"
import type { Database } from "@/lib/supabase/database.types"

type CloudProvider = Database["public"]["Tables"]["cloud_providers"]["Row"]
type CloudProviderCredential = Database["public"]["Tables"]["cloud_provider_credentials"]["Row"]

// Get all available cloud providers
export async function getCloudProviders(): Promise<CloudProvider[]> {
  const supabase = createServerComponentClient<Database>({ cookies })

  const { data, error } = await supabase.from("cloud_providers").select("*").order("name")

  if (error) {
    console.error("Error fetching cloud providers:", error)
    throw new Error("Failed to fetch cloud providers")
  }

  return data || []
}

// Get all cloud provider credentials for the current user
export async function getCloudProviderCredentials(): Promise<CloudProviderCredential[]> {
  const supabase = createServerComponentClient<Database>({ cookies })

  const { data: user } = await supabase.auth.getUser()
  if (!user.user) {
    throw new Error("User not authenticated")
  }

  const { data, error } = await supabase
    .from("cloud_provider_credentials")
    .select("*, cloud_providers(name, provider_type)")
    .eq("user_id", user.user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching cloud provider credentials:", error)
    throw new Error("Failed to fetch cloud provider credentials")
  }

  // Decrypt credentials
  const decryptedData = data.map((credential) => ({
    ...credential,
    credentials: credential.credentials ? JSON.parse(decrypt(credential.credentials)) : {},
  }))

  return decryptedData || []
}

// Get a specific cloud provider credential by ID
export async function getCloudProviderCredential(id: string): Promise<CloudProviderCredential> {
  const supabase = createServerComponentClient<Database>({ cookies })

  const { data: user } = await supabase.auth.getUser()
  if (!user.user) {
    throw new Error("User not authenticated")
  }

  const { data, error } = await supabase
    .from("cloud_provider_credentials")
    .select("*, cloud_providers(name, provider_type)")
    .eq("id", id)
    .eq("user_id", user.user.id)
    .single()

  if (error) {
    console.error("Error fetching cloud provider credential:", error)
    throw new Error("Failed to fetch cloud provider credential")
  }

  if (!data) {
    throw new Error("Cloud provider credential not found")
  }

  // Decrypt credentials
  return {
    ...data,
    credentials: data.credentials ? JSON.parse(decrypt(data.credentials)) : {},
  }
}

// Create a new cloud provider credential
export async function createCloudProviderCredential(
  providerId: number,
  name: string,
  credentials: Record<string, any>,
  isDefault = false,
): Promise<CloudProviderCredential> {
  const supabase = createServerComponentClient<Database>({ cookies })

  const { data: user } = await supabase.auth.getUser()
  if (!user.user) {
    throw new Error("User not authenticated")
  }

  // Encrypt credentials
  const encryptedCredentials = encrypt(JSON.stringify(credentials))

  // If this is the default credential, unset any existing default
  if (isDefault) {
    await supabase
      .from("cloud_provider_credentials")
      .update({ is_default: false })
      .eq("user_id", user.user.id)
      .eq("cloud_provider_id", providerId)
  }

  const { data, error } = await supabase
    .from("cloud_provider_credentials")
    .insert({
      user_id: user.user.id,
      cloud_provider_id: providerId,
      name,
      credentials: encryptedCredentials,
      is_default: isDefault,
    })
    .select("*")
    .single()

  if (error) {
    console.error("Error creating cloud provider credential:", error)
    throw new Error("Failed to create cloud provider credential")
  }

  return {
    ...data,
    credentials,
  }
}

// Update an existing cloud provider credential
export async function updateCloudProviderCredential(
  id: string,
  updates: {
    name?: string
    credentials?: Record<string, any>
    is_default?: boolean
  },
): Promise<CloudProviderCredential> {
  const supabase = createServerComponentClient<Database>({ cookies })

  const { data: user } = await supabase.auth.getUser()
  if (!user.user) {
    throw new Error("User not authenticated")
  }

  // Get the current credential to check provider ID
  const { data: currentCredential } = await supabase
    .from("cloud_provider_credentials")
    .select("cloud_provider_id")
    .eq("id", id)
    .eq("user_id", user.user.id)
    .single()

  if (!currentCredential) {
    throw new Error("Cloud provider credential not found")
  }

  // If setting as default, unset any existing default
  if (updates.is_default) {
    await supabase
      .from("cloud_provider_credentials")
      .update({ is_default: false })
      .eq("user_id", user.user.id)
      .eq("cloud_provider_id", currentCredential.cloud_provider_id)
  }

  // Prepare update object
  const updateData: any = {}
  if (updates.name !== undefined) updateData.name = updates.name
  if (updates.is_default !== undefined) updateData.is_default = updates.is_default
  if (updates.credentials) {
    updateData.credentials = encrypt(JSON.stringify(updates.credentials))
  }

  const { data, error } = await supabase
    .from("cloud_provider_credentials")
    .update(updateData)
    .eq("id", id)
    .eq("user_id", user.user.id)
    .select("*")
    .single()

  if (error) {
    console.error("Error updating cloud provider credential:", error)
    throw new Error("Failed to update cloud provider credential")
  }

  return {
    ...data,
    credentials: updates.credentials || (data.credentials ? JSON.parse(decrypt(data.credentials)) : {}),
  }
}

// Delete a cloud provider credential
export async function deleteCloudProviderCredential(id: string): Promise<void> {
  const supabase = createServerComponentClient<Database>({ cookies })

  const { data: user } = await supabase.auth.getUser()
  if (!user.user) {
    throw new Error("User not authenticated")
  }

  const { error } = await supabase.from("cloud_provider_credentials").delete().eq("id", id).eq("user_id", user.user.id)

  if (error) {
    console.error("Error deleting cloud provider credential:", error)
    throw new Error("Failed to delete cloud provider credential")
  }
}
