import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { triggerWorkflow } from "@/lib/workflows"

// This is a simple secret verification - in production, use proper HMAC verification
const WEBHOOK_SECRET = process.env.PAYMENT_WEBHOOK_SECRET || "default_webhook_secret"

export async function POST(request: NextRequest) {
  // Verify the webhook signature/secret
  const signature = request.headers.get("x-webhook-signature")
  if (!signature || signature !== WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  try {
    const payload = await request.json()
    const { event, data } = payload

    // Log the webhook event
    console.log(`Received payment webhook: ${event}`)

    // Get the Supabase client
    const supabase = await createClient()

    // Store the webhook event in the database
    const { error: insertError } = await supabase.from("webhook_events").insert({
      provider: "payment",
      event_type: event,
      payload: payload,
      processed: false,
    })

    if (insertError) {
      console.error("Error storing webhook event:", insertError)
      return NextResponse.json({ error: "Error storing webhook event" }, { status: 500 })
    }

    // Process the webhook based on the event type
    switch (event) {
      case "payment.succeeded":
        // Update subscription status
        await handlePaymentSucceeded(data, supabase)

        // Trigger n8n workflow for successful payment
        await triggerWorkflow("payment_success", data)
        break

      case "payment.failed":
        // Update subscription status
        await handlePaymentFailed(data, supabase)

        // Trigger n8n workflow for failed payment
        await triggerWorkflow("payment_failed", data)
        break

      case "subscription.created":
        // Handle new subscription
        await handleSubscriptionCreated(data, supabase)

        // Trigger n8n workflow for new subscription
        await triggerWorkflow("subscription_created", data)
        break

      default:
        // For other events, just log them
        console.log(`Unhandled payment event: ${event}`)
    }

    // Mark the webhook as processed
    await supabase
      .from("webhook_events")
      .update({ processed: true, processed_at: new Date().toISOString() })
      .eq("provider", "payment")
      .eq("event_type", event)
      .order("created_at", { ascending: false })
      .limit(1)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing payment webhook:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Helper functions to handle different payment events
async function handlePaymentSucceeded(data: any, supabase: any) {
  const { customer_id, subscription_id, amount } = data

  // Update user subscription status
  if (subscription_id) {
    const { error } = await supabase
      .from("subscriptions")
      .update({
        status: "active",
        last_payment_date: new Date().toISOString(),
        last_payment_amount: amount,
      })
      .eq("external_id", subscription_id)

    if (error) {
      console.error("Error updating subscription:", error)
    }
  }
}

async function handlePaymentFailed(data: any, supabase: any) {
  const { customer_id, subscription_id, error_message } = data

  // Update subscription status
  if (subscription_id) {
    const { error } = await supabase
      .from("subscriptions")
      .update({
        status: "payment_failed",
        last_error: error_message,
      })
      .eq("external_id", subscription_id)

    if (error) {
      console.error("Error updating subscription:", error)
    }
  }
}

async function handleSubscriptionCreated(data: any, supabase: any) {
  const { customer_id, subscription_id, plan_id, amount } = data

  // Find the user by customer ID
  const { data: userData, error: userError } = await supabase
    .from("user_payment_info")
    .select("user_id")
    .eq("customer_id", customer_id)
    .single()

  if (userError) {
    console.error("Error finding user:", userError)
    return
  }

  // Create a new subscription record
  const { error } = await supabase.from("subscriptions").insert({
    user_id: userData.user_id,
    external_id: subscription_id,
    plan_id: plan_id,
    amount: amount,
    status: "active",
    start_date: new Date().toISOString(),
  })

  if (error) {
    console.error("Error creating subscription:", error)
  }
}
