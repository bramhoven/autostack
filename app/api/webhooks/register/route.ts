import { type NextRequest, NextResponse } from "next/server"
import { apiKeyAuth, hasPermission } from "@/lib/api-auth"
import { registerWorkflowWebhook } from "@/lib/workflows"

export async function POST(request: NextRequest) {
  // Authenticate the request
  const auth = await apiKeyAuth(request)

  if (!auth.success) {
    return auth.response
  }

  // Check if the API key has the required permission
  if (!hasPermission(auth.permissions, "webhooks:manage")) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
  }

  try {
    // Get the webhook registration data
    const data = await request.json()
    const { key, webhook_url, secret } = data

    if (!key || !webhook_url) {
      return NextResponse.json({ error: "Key and webhook URL are required" }, { status: 400 })
    }

    // Register the workflow webhook
    const success = await registerWorkflowWebhook(key, webhook_url, secret || "", auth.userId)

    if (!success) {
      return NextResponse.json({ error: "Failed to register webhook" }, { status: 500 })
    }

    return NextResponse.json({ success: true, key })
  } catch (error) {
    console.error("Error registering webhook:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
