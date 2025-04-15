import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// API key authentication middleware
export async function apiKeyAuth(request: NextRequest) {
  // Get the API key from the Authorization header
  const apiKey = request.headers.get("Authorization")?.replace("Bearer ", "")

  if (!apiKey) {
    return {
      success: false,
      response: NextResponse.json({ error: "API key is required" }, { status: 401 }),
    }
  }

  // Get the Supabase client
  const supabase = await createClient()

  // Check if the API key is valid
  const { data: apiKeyData, error } = await supabase
    .from("api_keys")
    .select("id, user_id, name, permissions")
    .eq("key", apiKey)
    .eq("active", true)
    .single()

  if (error || !apiKeyData) {
    return {
      success: false,
      response: NextResponse.json({ error: "Invalid API key" }, { status: 401 }),
    }
  }

  // Check if the API key has expired
  const { data: apiKeyExpiry, error: expiryError } = await supabase
    .from("api_keys")
    .select("expires_at")
    .eq("id", apiKeyData.id)
    .single()

  if (expiryError) {
    return {
      success: false,
      response: NextResponse.json({ error: "Error checking API key expiry" }, { status: 500 }),
    }
  }

  if (apiKeyExpiry.expires_at && new Date(apiKeyExpiry.expires_at) < new Date()) {
    return {
      success: false,
      response: NextResponse.json({ error: "API key has expired" }, { status: 401 }),
    }
  }

  // Update the last used timestamp
  await supabase.from("api_keys").update({ last_used_at: new Date().toISOString() }).eq("id", apiKeyData.id)

  // Return the user ID and permissions
  return {
    success: true,
    userId: apiKeyData.user_id,
    permissions: apiKeyData.permissions || [],
    keyName: apiKeyData.name,
  }
}

// Check if the API key has the required permission
export function hasPermission(permissions: string[], requiredPermission: string) {
  return permissions.includes("*") || permissions.includes(requiredPermission)
}
