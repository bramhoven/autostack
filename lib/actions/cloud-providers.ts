"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { encrypt, decrypt } from "@/lib/encryption"
import { revalidatePath } from "next/cache"

// Types for cloud providers
export type CloudProvider = {
  id: string
  name: string
  type: string
  fields: CloudProviderField[]
}

export type CloudProviderField = {
  name: string
  label: string
  type: string
  required: boolean
  placeholder?: string
  description?: string
}

// Types for cloud provider credentials
export type CloudProviderCredential = {
  id: string
  name: string
  provider_id: string
  provider_name: string
  provider_type: string
  credentials: Record<string, string>
  created_at: string
}

// Get all cloud providers
export async function getCloudProviders(): Promise<CloudProvider[]> {
  try {
    // Create a Supabase client
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            // This is a server action, we don't need to set cookies
          },
          remove(name: string, options: any) {
            // This is a server action, we don't need to remove cookies
          },
        },
      },
    )

    // Get the session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) {
      console.error("Session error:", sessionError.message)
      throw new Error("Authentication failed")
    }

    if (!sessionData.session) {
      throw new Error("Not authenticated")
    }

    // Get all cloud providers
    const { data, error } = await supabase.from("cloud_providers").select("*")

    if (error) {
      console.error("Error fetching cloud providers:", error.message)
      throw new Error("Failed to fetch cloud providers")
    }

    return data || []
  } catch (error) {
    console.error("Error in getCloudProviders:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to fetch cloud providers")
  }
}

// Get all cloud provider credentials for the current user
export async function getCloudProviderCredentials(): Promise<CloudProviderCredential[]> {
  try {
    // Create a Supabase client
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            // This is a server action, we don't need to set cookies
          },
          remove(name: string, options: any) {
            // This is a server action, we don't need to remove cookies
          },
        },
      },
    )

    // Get the session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) {
      console.error("Session error:", sessionError.message)
      throw new Error("Authentication failed")
    }

    if (!sessionData.session) {
      throw new Error("Not authenticated")
    }

    const userId = sessionData.session.user.id

    // Get all cloud provider credentials for the current user
    const { data, error } = await supabase
      .from("cloud_provider_credentials")
      .select(
        `
        *,
        cloud_providers (
          name,
          type
        )
      `,
      )
      .eq("user_id", userId)

    if (error) {
      console.error("Error fetching cloud provider credentials:", error.message)
      throw new Error("Failed to fetch cloud provider credentials")
    }

    // Decrypt the credentials
    const decryptedCredentials = await Promise.all(
      (data || []).map(async (credential) => {
        try {
          const decryptedCreds = credential.credentials ? await decrypt(credential.credentials) : "{}"

          return {
            id: credential.id,
            name: credential.name,
            provider_id: credential.provider_id,
            provider_name: credential.cloud_providers?.name || "Unknown",
            provider_type: credential.cloud_providers?.type || "unknown",
            credentials: JSON.parse(decryptedCreds),
            created_at: credential.created_at,
          }
        } catch (error) {
          console.error("Error decrypting credentials:", error)
          return {
            id: credential.id,
            name: credential.name,
            provider_id: credential.provider_id,
            provider_name: credential.cloud_providers?.name || "Unknown",
            provider_type: credential.cloud_providers?.type || "unknown",
            credentials: {},
            created_at: credential.created_at,
          }
        }
      }),
    )

    return decryptedCredentials
  } catch (error) {
    console.error("Error in getCloudProviderCredentials:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to fetch cloud provider credentials")
  }
}

// Get a single cloud provider credential by ID
export async function getCloudProviderCredential(id: string): Promise<CloudProviderCredential | null> {
  try {
    if (!id) {
      throw new Error("Credential ID is required")
    }

    // Create a Supabase client
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            // This is a server action, we don't need to set cookies
          },
          remove(name: string, options: any) {
            // This is a server action, we don't need to remove cookies
          },
        },
      },
    )

    // Get the session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) {
      console.error("Session error:", sessionError.message)
      throw new Error("Authentication failed")
    }

    if (!sessionData.session) {
      throw new Error("Not authenticated")
    }

    const userId = sessionData.session.user.id

    // Get the cloud provider credential
    const { data, error } = await supabase
      .from("cloud_provider_credentials")
      .select(
        `
        *,
        cloud_providers (
          name,
          type
        )
      `,
      )
      .eq("id", id)
      .eq("user_id", userId)
      .single()

    if (error) {
      console.error("Error fetching cloud provider credential:", error.message)
      throw new Error("Failed to fetch cloud provider credential")
    }

    if (!data) {
      return null
    }

    // Decrypt the credentials
    try {
      const decryptedCreds = data.credentials ? await decrypt(data.credentials) : "{}"

      return {
        id: data.id,
        name: data.name,
        provider_id: data.provider_id,
        provider_name: data.cloud_providers?.name || "Unknown",
        provider_type: data.cloud_providers?.type || "unknown",
        credentials: JSON.parse(decryptedCreds),
        created_at: data.created_at,
      }
    } catch (error) {
      console.error("Error decrypting credentials:", error)
      return {
        id: data.id,
        name: data.name,
        provider_id: data.provider_id,
        provider_name: data.cloud_providers?.name || "Unknown",
        provider_type: data.cloud_providers?.type || "unknown",
        credentials: {},
        created_at: data.created_at,
      }
    }
  } catch (error) {
    console.error("Error in getCloudProviderCredential:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to fetch cloud provider credential")
  }
}

// Create a new cloud provider credential
export async function createCloudProviderCredential(
  name: string,
  providerId: string,
  credentials: Record<string, string>,
): Promise<{ success: boolean; message: string; id?: string }> {
  try {
    console.log("Creating cloud provider credential:", { name, providerId })

    // Create a Supabase client
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            // This is a server action, we don't need to set cookies
          },
          remove(name: string, options: any) {
            // This is a server action, we don't need to remove cookies
          },
        },
      },
    )

    // Get the session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) {
      console.error("Session error:", sessionError.message)
      throw new Error("Authentication failed")
    }

    if (!sessionData.session) {
      throw new Error("Not authenticated")
    }

    const userId = sessionData.session.user.id

    // Encrypt the credentials
    let encryptedCredentials
    try {
      encryptedCredentials = await encrypt(JSON.stringify(credentials))
    } catch (error) {
      console.error("Error encrypting credentials:", error)
      throw new Error("Failed to encrypt credentials")
    }

    // Create the cloud provider credential
    const { data, error } = await supabase
      .from("cloud_provider_credentials")
      .insert([
        {
          name,
          provider_id: providerId,
          credentials: encryptedCredentials,
          user_id: userId,
        },
      ])
      .select()

    if (error) {
      console.error("Error creating cloud provider credential:", error.message)
      throw new Error(`Failed to create cloud provider credential: ${error.message}`)
    }

    // Revalidate the cloud providers page
    revalidatePath("/cloud-providers")

    return {
      success: true,
      message: "Cloud provider credential created successfully",
      id: data?.[0]?.id,
    }
  } catch (error) {
    console.error("Error in createCloudProviderCredential:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create cloud provider credential",
    }
  }
}

// Update an existing cloud provider credential
export async function updateCloudProviderCredential(
  id: string,
  name: string,
  providerId: string,
  credentials: Record<string, string>,
): Promise<{ success: boolean; message: string }> {
  try {
    if (!id) {
      throw new Error("Credential ID is required")
    }

    // Create a Supabase client
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            // This is a server action, we don't need to set cookies
          },
          remove(name: string, options: any) {
            // This is a server action, we don't need to remove cookies
          },
        },
      },
    )

    // Get the session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) {
      console.error("Session error:", sessionError.message)
      throw new Error("Authentication failed")
    }

    if (!sessionData.session) {
      throw new Error("Not authenticated")
    }

    const userId = sessionData.session.user.id

    // Encrypt the credentials
    let encryptedCredentials
    try {
      encryptedCredentials = await encrypt(JSON.stringify(credentials))
    } catch (error) {
      console.error("Error encrypting credentials:", error)
      throw new Error("Failed to encrypt credentials")
    }

    // Update the cloud provider credential
    const { error } = await supabase
      .from("cloud_provider_credentials")
      .update({
        name,
        provider_id: providerId,
        credentials: encryptedCredentials,
      })
      .eq("id", id)
      .eq("user_id", userId)

    if (error) {
      console.error("Error updating cloud provider credential:", error.message)
      throw new Error("Failed to update cloud provider credential")
    }

    // Revalidate the cloud providers page
    revalidatePath("/cloud-providers")

    return {
      success: true,
      message: "Cloud provider credential updated successfully",
    }
  } catch (error) {
    console.error("Error in updateCloudProviderCredential:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update cloud provider credential",
    }
  }
}

// Delete a cloud provider credential
export async function deleteCloudProviderCredential(id: string): Promise<{ success: boolean; message: string }> {
  try {
    if (!id) {
      throw new Error("Credential ID is required")
    }

    // Create a Supabase client
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            // This is a server action, we don't need to set cookies
          },
          remove(name: string, options: any) {
            // This is a server action, we don't need to remove cookies
          },
        },
      },
    )

    // Get the session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) {
      console.error("Session error:", sessionError.message)
      throw new Error("Authentication failed")
    }

    if (!sessionData.session) {
      throw new Error("Not authenticated")
    }

    const userId = sessionData.session.user.id

    // Delete the cloud provider credential
    const { error } = await supabase.from("cloud_provider_credentials").delete().eq("id", id).eq("user_id", userId)

    if (error) {
      console.error("Error deleting cloud provider credential:", error.message)
      throw new Error("Failed to delete cloud provider credential")
    }

    // Revalidate the cloud providers page
    revalidatePath("/cloud-providers")

    return {
      success: true,
      message: "Cloud provider credential deleted successfully",
    }
  } catch (error) {
    console.error("Error in deleteCloudProviderCredential:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete cloud provider credential",
    }
  }
}
