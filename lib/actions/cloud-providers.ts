"use server"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { encrypt, decrypt } from "@/lib/encryption"
import { revalidatePath } from "next/cache"
import type { Database } from "@/lib/supabase/database.types"

type CloudProvider = Database["public"]["Tables"]["cloud_providers"]["Row"]
type CloudProviderCredential = Database["public"]["Tables"]["cloud_provider_credentials"]["Row"]

// Get all available cloud providers
export async function getCloudProviders(): Promise<CloudProvider[]> {
  const supabase = createServerComponentClient<Database>({ cookies })

  const { data, error } = await supabase.from("cloud_providers").select("*").eq("is_active", true).order("name")

  if (error) {
    console.error("Error fetching cloud providers:", error)
    throw new Error("Failed to fetch cloud providers")
  }

  return data || []
}

// Get all cloud provider credentials for the current user
export async function getCloudProviderCredentials(): Promise<any[]> {
  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    throw new Error("User not authenticated")
  }

  const { data, error } = await supabase
    .from("cloud_provider_credentials")
    .select(`
      *,
      cloud_providers (
        id,
        name,
        slug,
        logo_url
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching cloud provider credentials:", error)
    throw new Error("Failed to fetch cloud provider credentials")
  }

  // Decrypt sensitive credentials
  const decryptedData = data.map((credential) => {
    const decryptedCredentials = { ...credential.credentials }

    // Decrypt sensitive fields based on provider type
    if (credential.cloud_providers?.slug === "aws") {
      if (decryptedCredentials.aws_secret_access_key) {
        decryptedCredentials.aws_secret_access_key = decrypt(decryptedCredentials.aws_secret_access_key as string)
      }
    } else if (credential.cloud_providers?.slug === "digitalocean") {
      if (decryptedCredentials.api_token) {
        decryptedCredentials.api_token = decrypt(decryptedCredentials.api_token as string)
      }
    } else if (credential.cloud_providers?.slug === "gcp") {
      if (decryptedCredentials.private_key) {
        decryptedCredentials.private_key = decrypt(decryptedCredentials.private_key as string)
      }
    } else if (credential.cloud_providers?.slug === "azure") {
      if (decryptedCredentials.client_secret) {
        decryptedCredentials.client_secret = decrypt(decryptedCredentials.client_secret as string)
      }
    } else if (credential.cloud_providers?.slug === "linode") {
      if (decryptedCredentials.api_token) {
        decryptedCredentials.api_token = decrypt(decryptedCredentials.api_token as string)
      }
    } else if (credential.cloud_providers?.slug === "vultr") {
      if (decryptedCredentials.api_key) {
        decryptedCredentials.api_key = decrypt(decryptedCredentials.api_key as string)
      }
    }

    return {
      ...credential,
      credentials: decryptedCredentials,
    }
  })

  return decryptedData || []
}

// Get a specific cloud provider credential by ID
export async function getCloudProviderCredential(id: string): Promise<any> {
  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    throw new Error("User not authenticated")
  }

  const { data, error } = await supabase
    .from("cloud_provider_credentials")
    .select(`
      *,
      cloud_providers (
        id,
        name,
        slug,
        logo_url
      )
    `)
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error) {
    console.error(`Error fetching cloud provider credential with id ${id}:`, error)
    throw new Error("Failed to fetch cloud provider credential")
  }

  // Decrypt sensitive credentials
  const decryptedCredentials = { ...data.credentials }

  // Decrypt sensitive fields based on provider type
  if (data.cloud_providers?.slug === "aws") {
    if (decryptedCredentials.aws_secret_access_key) {
      decryptedCredentials.aws_secret_access_key = decrypt(decryptedCredentials.aws_secret_access_key as string)
    }
  } else if (data.cloud_providers?.slug === "digitalocean") {
    if (decryptedCredentials.api_token) {
      decryptedCredentials.api_token = decrypt(decryptedCredentials.api_token as string)
    }
  } else if (data.cloud_providers?.slug === "gcp") {
    if (decryptedCredentials.private_key) {
      decryptedCredentials.private_key = decrypt(decryptedCredentials.private_key as string)
    }
  } else if (data.cloud_providers?.slug === "azure") {
    if (decryptedCredentials.client_secret) {
      decryptedCredentials.client_secret = decrypt(decryptedCredentials.client_secret as string)
    }
  } else if (data.cloud_providers?.slug === "linode") {
    if (decryptedCredentials.api_token) {
      decryptedCredentials.api_token = decrypt(decryptedCredentials.api_token as string)
    }
  } else if (data.cloud_providers?.slug === "vultr") {
    if (decryptedCredentials.api_key) {
      decryptedCredentials.api_key = decrypt(decryptedCredentials.api_key as string)
    }
  }

  return {
    ...data,
    credentials: decryptedCredentials,
  }
}

// Create a new cloud provider credential
export async function createCloudProviderCredential(
  providerId: number,
  name: string,
  credentials: Record<string, any>,
  isDefault = false,
): Promise<any> {
  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    throw new Error("User not authenticated")
  }

  // Get the provider to determine which fields to encrypt
  const { data: provider, error: providerError } = await supabase
    .from("cloud_providers")
    .select("slug")
    .eq("id", providerId)
    .single()

  if (providerError) {
    console.error(`Error fetching cloud provider with id ${providerId}:`, providerError)
    throw new Error("Failed to fetch cloud provider")
  }

  // Encrypt sensitive credentials
  const encryptedCredentials = { ...credentials }

  // Encrypt sensitive fields based on provider type
  if (provider.slug === "aws") {
    if (encryptedCredentials.aws_secret_access_key) {
      encryptedCredentials.aws_secret_access_key = encrypt(encryptedCredentials.aws_secret_access_key)
    }
  } else if (provider.slug === "digitalocean") {
    if (encryptedCredentials.api_token) {
      encryptedCredentials.api_token = encrypt(encryptedCredentials.api_token)
    }
  } else if (provider.slug === "gcp") {
    if (encryptedCredentials.private_key) {
      encryptedCredentials.private_key = encrypt(encryptedCredentials.private_key)
    }
  } else if (provider.slug === "azure") {
    if (encryptedCredentials.client_secret) {
      encryptedCredentials.client_secret = encrypt(encryptedCredentials.client_secret)
    }
  } else if (provider.slug === "linode") {
    if (encryptedCredentials.api_token) {
      encryptedCredentials.api_token = encrypt(encryptedCredentials.api_token)
    }
  } else if (provider.slug === "vultr") {
    if (encryptedCredentials.api_key) {
      encryptedCredentials.api_key = encrypt(encryptedCredentials.api_key)
    }
  }

  // If this is set as default, unset any existing default for this provider
  if (isDefault) {
    await supabase
      .from("cloud_provider_credentials")
      .update({ is_default: false })
      .eq("user_id", user.id)
      .eq("provider_id", providerId)
  }

  const { data, error } = await supabase
    .from("cloud_provider_credentials")
    .insert({
      user_id: user.id,
      provider_id: providerId,
      name,
      credentials: encryptedCredentials,
      is_default: isDefault,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating cloud provider credential:", error)
    throw new Error("Failed to create cloud provider credential")
  }

  revalidatePath("/cloud-providers")
  revalidatePath("/servers/add")

  return data
}

// Update a cloud provider credential
export async function updateCloudProviderCredential(
  id: string,
  updates: {
    name?: string
    credentials?: Record<string, any>
    is_default?: boolean
  },
): Promise<any> {
  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    throw new Error("User not authenticated")
  }

  // Get the current credential to determine which fields to encrypt
  const { data: currentCredential, error: credentialError } = await supabase
    .from("cloud_provider_credentials")
    .select(`
      *,
      cloud_providers (
        slug
      )
    `)
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (credentialError) {
    console.error(`Error fetching cloud provider credential with id ${id}:`, credentialError)
    throw new Error("Failed to fetch cloud provider credential")
  }

  // Prepare updates
  const updateData: any = {}

  if (updates.name) {
    updateData.name = updates.name
  }

  if (updates.is_default !== undefined) {
    updateData.is_default = updates.is_default

    // If setting as default, unset any existing default for this provider
    if (updates.is_default) {
      await supabase
        .from("cloud_provider_credentials")
        .update({ is_default: false })
        .eq("user_id", user.id)
        .eq("provider_id", currentCredential.provider_id)
        .neq("id", id)
    }
  }

  if (updates.credentials) {
    // Encrypt sensitive credentials
    const encryptedCredentials = { ...updates.credentials }

    // Encrypt sensitive fields based on provider type
    if (currentCredential.cloud_providers?.slug === "aws") {
      if (encryptedCredentials.aws_secret_access_key) {
        encryptedCredentials.aws_secret_access_key = encrypt(encryptedCredentials.aws_secret_access_key)
      }
    } else if (currentCredential.cloud_providers?.slug === "digitalocean") {
      if (encryptedCredentials.api_token) {
        encryptedCredentials.api_token = encrypt(encryptedCredentials.api_token)
      }
    } else if (currentCredential.cloud_providers?.slug === "gcp") {
      if (encryptedCredentials.private_key) {
        encryptedCredentials.private_key = encrypt(encryptedCredentials.private_key)
      }
    } else if (currentCredential.cloud_providers?.slug === "azure") {
      if (encryptedCredentials.client_secret) {
        encryptedCredentials.client_secret = encrypt(encryptedCredentials.client_secret)
      }
    } else if (currentCredential.cloud_providers?.slug === "linode") {
      if (encryptedCredentials.api_token) {
        encryptedCredentials.api_token = encrypt(encryptedCredentials.api_token)
      }
    } else if (currentCredential.cloud_providers?.slug === "vultr") {
      if (encryptedCredentials.api_key) {
        encryptedCredentials.api_key = encrypt(encryptedCredentials.api_key)
      }
    }

    updateData.credentials = encryptedCredentials
  }

  updateData.updated_at = new Date().toISOString()

  const { data, error } = await supabase
    .from("cloud_provider_credentials")
    .update(updateData)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    console.error(`Error updating cloud provider credential with id ${id}:`, error)
    throw new Error("Failed to update cloud provider credential")
  }

  revalidatePath("/cloud-providers")
  revalidatePath("/servers/add")

  return data
}

// Delete a cloud provider credential
export async function deleteCloudProviderCredential(id: string): Promise<{ success: boolean }> {
  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    throw new Error("User not authenticated")
  }

  const { error } = await supabase.from("cloud_provider_credentials").delete().eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error(`Error deleting cloud provider credential with id ${id}:`, error)
    throw new Error("Failed to delete cloud provider credential")
  }

  revalidatePath("/cloud-providers")
  revalidatePath("/servers/add")

  return { success: true }
}
