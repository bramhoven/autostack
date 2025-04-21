import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest, { params }: { params: { key: string } }) {
  const key = params.key

  if (!key) {
    return NextResponse.json({ error: "Webhook key is required" }, { status: 400 })
  }

  try {
    // Get the webhook secret from the query parameters
    const searchParams = request.nextUrl.searchParams
    const secret = searchParams.get("secret")

    if (!secret) {
      return NextResponse.json({ error: "Webhook secret is required" }, { status: 401 })
    }

    // Get the Supabase client
    const supabase = await createClient()

    // Get the webhook configuration
    const { data: webhook, error } = await supabase
      .from("workflow_webhooks")
      .select("id, user_id, webhook_url, secret")
      .eq("key", key)
      .single()

    if (error || !webhook) {
      console.error(`Webhook with key ${key} not found:`, error)
      return NextResponse.json({ error: "Webhook not found" }, { status: 404 })
    }

    // Verify the secret
    if (webhook.secret !== secret) {
      return NextResponse.json({ error: "Invalid webhook secret" }, { status: 401 })
    }

    // Get the payload
    const payload = await request.json()

    // Update the last triggered timestamp
    await supabase
      .from("workflow_webhooks")
      .update({ last_triggered_at: new Date().toISOString() })
      .eq("id", webhook.id)

    // Log the webhook event
    await supabase.from("webhook_events").insert({
      webhook_id: webhook.id,
      user_id: webhook.user_id,
      payload,
      created_at: new Date().toISOString(),
    })

    // If the webhook has a URL configured, forward the request
    if (webhook.webhook_url) {
      try {
        const response = await fetch(webhook.webhook_url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          console.error(`Error forwarding webhook to ${webhook.webhook_url}:`, await response.text())
        }
      } catch (forwardError) {
        console.error(`Error forwarding webhook to ${webhook.webhook_url}:`, forwardError)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error processing webhook ${key}:`, error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
