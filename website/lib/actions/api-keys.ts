"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import crypto from "crypto"

// Generate a random API key
function generateApiKey() {
  return `sk_${crypto.randomBytes(24).toString("hex")}`
}

// Create a new API key
export async function createApiKey(data: {
  name: string
  permissions: string[]
  expires_at: string | null
}) {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error("Not authenticated")
  }

  // Generate a new API key
  const key = generateApiKey()

  // Hash the key for storage
  const hashedKey = crypto.createHash("sha256").update(key).digest("hex")

  // Insert the new API key
  const { data: apiKey, error } = await supabase
    .from("api_keys")
    .insert({
      user_id: session.user.id,
      name: data.name,
      key: hashedKey, // Store the hashed key
      permissions: data.permissions,
      expires_at: data.expires_at,
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating API key:", error)
    throw new Error("Failed to create API key")
  }

  revalidatePath("/settings")

  // Return the unhashed key (this is the only time it will be available)
  return {
    id: apiKey.id,
    key,
  }
}

// Get all API keys for the current user
export async function getApiKeys() {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error("Not authenticated")
  }

  const { data, error } = await supabase
    .from("api_keys")
    .select("id, name, created_at, expires_at, last_used_at, permissions")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching API keys:", error)
    throw new Error("Failed to fetch API keys")
  }

  return data
}

// Delete an API key
export async function deleteApiKey(id: string) {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error("Not authenticated")
  }

  const { error } = await supabase.from("api_keys").delete().eq("id", id).eq("user_id", session.user.id)

  if (error) {
    console.error("Error deleting API key:", error)
    throw new Error("Failed to delete API key")
  }

  revalidatePath("/settings")
  return { success: true }
}
