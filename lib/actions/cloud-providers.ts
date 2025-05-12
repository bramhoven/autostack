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
  try {
    const supabase = createServerComponentClient<Database>({ cookies })

    const { data, error } = await supabase.from("cloud_providers").select("*").eq("is_active", true).order("name")

    if (error) {
      console.error("Error fetching cloud providers:", error)
      throw new Error(`Failed to fetch cloud providers: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error("Error in getCloudProviders:", error)
    throw new Error(`Failed to fetch cloud providers: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// Get all cloud provider credentials for the current user
export async function getCloudProviderCredentials(): Promise<any[]> {
  try {
    const supabase = createServerComponentClient<Database>({ cookies })

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      throw new Error("User not authenticated")
    }

    // First, check if the table exists
    try {
      const { data, error } = await supabase
        .from("cloud_provider_credentials")
        .select(`
          id,
          name,
          provider_id,
          credentials,
          is_default,
          created_at,
          updated_at,
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
        throw new Error(`Failed to fetch cloud provider credentials: ${error.message}`)
      }

      // Return data without attempting decryption if no credentials exist
      if (!data || data.length === 0) {
        return []
      }

      // Process each credential safely
      const processedData = data.map((credential) => {
        try {
          // Skip decryption if credentials is null or not an object
          if (!credential.credentials || typeof credential.credentials !== "object") {
            return credential
          }

          const decryptedCredentials = { ...credential.credentials }

          // Only attempt to decrypt if the provider slug exists and the field exists
          if (credential.cloud_providers?.slug === "aws") {
            if (decryptedCredentials.aws_secret_access_key) {
              try {
                decryptedCredentials.aws_secret_access_key = decrypt(
                  decryptedCredentials.aws_secret_access_key as string,
                )
              } catch (e) {
                console.error("Failed to decrypt AWS secret key:", e)
                // Keep the encrypted value if decryption fails
              }
            }
          } else if (credential.cloud_providers?.slug === "digitalocean") {
            if (decryptedCredentials.api_token) {
              try {
                decryptedCredentials.api_token = decrypt(decryptedCredentials.api_token as string)
              } catch (e) {
                console.error("Failed to decrypt DigitalOcean API token:", e)
              }
            }
          } else if (credential.cloud_providers?.slug === "gcp") {
            if (decryptedCredentials.private_key) {
              try {
                decryptedCredentials.private_key = decrypt(decryptedCredentials.private_key as string)
              } catch (e) {
                console.error("Failed to decrypt GCP private key:", e)
              }
            }
          } else if (credential.cloud_providers?.slug === "azure") {
            if (decryptedCredentials.client_secret) {
              try {
                decryptedCredentials.client_secret = decrypt(decryptedCredentials.client_secret as string)
              } catch (e) {
                console.error("Failed to decrypt Azure client secret:", e)
              }
            }
          } else if (credential.cloud_providers?.slug === "linode") {
            if (decryptedCredentials.api_token) {
              try {
                decryptedCredentials.api_token = decrypt(decryptedCredentials.api_token as string)
              } catch (e) {
                console.error("Failed to decrypt Linode API token:", e)
              }
            }
          } else if (credential.cloud_providers?.slug === "vultr") {
            if (decryptedCredentials.api_key) {
              try {
                decryptedCredentials.api_key = decrypt(decryptedCredentials.api_key as string)
              } catch (e) {
                console.error("Failed to decrypt Vultr API key:", e)
              }
            }
          }

          return {
            ...credential,
            credentials: decryptedCredentials,
          }
        } catch (error) {
          console.error("Error processing credential:", error)
          // Return the original credential if there's an error
          return credential
        }
      })

      return processedData
    } catch (error) {
      console.error("Error in database query:", error)
      return [] // Return empty array on error
    }
  } catch (error) {
    console.error("Error in getCloudProviderCredentials:", error)
    return [] // Return empty array on error
  }
}

// Get a specific cloud provider credential by ID
export async function getCloudProviderCredential(id: string): Promise<any> {
  try {
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
        id,
        name,
        provider_id,
        credentials,
        is_default,
        created_at,
        updated_at,
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
      throw new Error(`Failed to fetch cloud provider credential: ${error.message}`)
    }

    if (!data) {
      throw new Error("Cloud provider credential not found")
    }

    // Skip decryption if credentials is null or not an object
    if (!data.credentials || typeof data.credentials !== "object") {
      return data
    }

    // Decrypt sensitive credentials
    try {
      const decryptedCredentials = { ...data.credentials }

      // Only attempt to decrypt if the provider slug exists and the field exists
      if (data.cloud_providers?.slug === "aws") {
        if (decryptedCredentials.aws_secret_access_key) {
          try {
            decryptedCredentials.aws_secret_access_key = decrypt(decryptedCredentials.aws_secret_access_key as string)
          } catch (e) {
            console.error("Failed to decrypt AWS secret key:", e)
            // Keep the encrypted value if decryption fails
          }
        }
      } else if (data.cloud_providers?.slug === "digitalocean") {
        if (decryptedCredentials.api_token) {
          try {
            decryptedCredentials.api_token = decrypt(decryptedCredentials.api_token as string)
          } catch (e) {
            console.error("Failed to decrypt DigitalOcean API token:", e)
          }
        }
      } else if (data.cloud_providers?.slug === "gcp") {
        if (decryptedCredentials.private_key) {
          try {
            decryptedCredentials.private_key = decrypt(decryptedCredentials.private_key as string)
          } catch (e) {
            console.error("Failed to decrypt GCP private key:", e)
          }
        }
      } else if (data.cloud_providers?.slug === "azure") {
        if (decryptedCredentials.client_secret) {
          try {
            decryptedCredentials.client_secret = decrypt(decryptedCredentials.client_secret as string)
          } catch (e) {
            console.error("Failed to decrypt Azure client secret:", e)
          }
        }
      } else if (data.cloud_providers?.slug === "linode") {
        if (decryptedCredentials.api_token) {
          try {
            decryptedCredentials.api_token = decrypt(decryptedCredentials.api_token as string)
          } catch (e) {
            console.error("Failed to decrypt Linode API token:", e)
          }
        }
      } else if (data.cloud_providers?.slug === "vultr") {
        if (decryptedCredentials.api_key) {
          try {
            decryptedCredentials.api_key = decrypt(decryptedCredentials.api_key as string)
          } catch (e) {
            console.error("Failed to decrypt Vultr API key:", e)
          }
        }
      }

      return {
        ...data,
        credentials: decryptedCredentials,
      }
    } catch (error) {
      console.error("Error decrypting credentials:", error)
      return data // Return original data if decryption fails
    }
  } catch (error) {
    console.error("Error in getCloudProviderCredential:", error)
    throw new Error(
      `Failed to fetch cloud provider credential: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

// Create a new cloud provider credential
export async function createCloudProviderCredential(
  providerId: number,
  name: string,
  credentials: Record<string, any>,
  isDefault = false,
): Promise<any> {
  try {
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
      throw new Error(`Failed to fetch cloud provider: ${providerError.message}`)
    }

    // Encrypt sensitive credentials
    const encryptedCredentials = { ...credentials }

    try {
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
    } catch (error) {
      console.error("Error encrypting credentials:", error)
      throw new Error(`Failed to encrypt credentials: ${error instanceof Error ? error.message : String(error)}`)
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
      throw new Error(`Failed to create cloud provider credential: ${error.message}`)
    }

    revalidatePath("/cloud-providers")
    revalidatePath("/servers/add")

    return data
  } catch (error) {
    console.error("Error in createCloudProviderCredential:", error)
    throw new Error(
      `Failed to create cloud provider credential: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
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
  try {
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
      throw new Error(`Failed to fetch cloud provider credential: ${credentialError.message}`)
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
      try {
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
      } catch (error) {
        console.error("Error encrypting credentials:", error)
        throw new Error(`Failed to encrypt credentials: ${error instanceof Error ? error.message : String(error)}`)
      }
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
      throw new Error(`Failed to update cloud provider credential: ${error.message}`)
    }

    revalidatePath("/cloud-providers")
    revalidatePath("/servers/add")

    return data
  } catch (error) {
    console.error("Error in updateCloudProviderCredential:", error)
    throw new Error(
      `Failed to update cloud provider credential: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

// Delete a cloud provider credential
export async function deleteCloudProviderCredential(id: string): Promise<{ success: boolean }> {
  try {
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
      throw new Error(`Failed to delete cloud provider credential: ${error.message}`)
    }

    revalidatePath("/cloud-providers")
    revalidatePath("/servers/add")

    return { success: true }
  } catch (error) {
    console.error("Error in deleteCloudProviderCredential:", error)
    throw new Error(
      `Failed to delete cloud provider credential: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}
