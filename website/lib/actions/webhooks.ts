"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import crypto from "crypto"

// Generate a random webhook secret
function generateSecret() {
  return crypto.randomBytes(16).toString("hex")
}

// Create a new webhook
export async function createWebhook(data: {
  key: string
  name: string
  description?: string
}) {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error("Not authenticated")
  }

  // Generate a secret for the webhook
  const secret = generateSecret()

  // Check if a webhook with this key already exists
  const { data: existingWebhook, error: checkError } = await supabase
    .from("workflow_webhooks")
    .select("id")
    .eq("key", data.key)
    .eq("user_id", session.user.id)
    .single()

  if (existingWebhook) {
    throw new Error(`A webhook with the key '${data.key}' already exists`)
  }

  // Insert the new webhook
  const { data: webhook, error } = await supabase
    .from("workflow_webhooks")
    .insert({
      user_id: session.user.id,
      key: data.key,
      name: data.name,
      description: data.description || null,
      secret,
      created_at: new Date().toISOString(),
      created_by: session.user.id,
      updated_by: session.user.id,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating webhook:", error)
    throw new Error("Failed to create webhook")
  }

  revalidatePath("/settings")

  return webhook
}

// Get all webhooks for the current user
export async function getWebhooks() {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error("Not authenticated")
  }

  const { data, error } = await supabase
    .from("workflow_webhooks")
    .select("id, key, name, description, created_at, last_triggered_at, secret")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching webhooks:", error)
    throw new Error("Failed to fetch webhooks")
  }

  return data
}

// Delete a webhook
export async function deleteWebhook(id: string) {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error("Not authenticated")
  }

  const { error } = await supabase.from("workflow_webhooks").delete().eq("id", id).eq("user_id", session.user.id)

  if (error) {
    console.error("Error deleting webhook:", error)
    throw new Error("Failed to delete webhook")
  }

  revalidatePath("/settings")
  return { success: true }
}
