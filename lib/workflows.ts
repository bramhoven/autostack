import { createClient } from "@/lib/supabase/server"

// Function to trigger an n8n workflow via webhook
export async function triggerWorkflow(workflowKey: string, data: any) {
  try {
    // Get the Supabase client
    const supabase = await createClient()

    // Get the workflow webhook URL from the database
    const { data: workflow, error } = await supabase
      .from("workflow_webhooks")
      .select("webhook_url, secret")
      .eq("key", workflowKey)
      .single()

    if (error || !workflow) {
      console.error(`Workflow with key ${workflowKey} not found:`, error)
      return false
    }

    // Trigger the n8n workflow by calling its webhook URL
    const response = await fetch(workflow.webhook_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Secret": workflow.secret || "",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Error triggering workflow ${workflowKey}:`, errorText)
      return false
    }

    console.log(`Successfully triggered workflow ${workflowKey}`)
    return true
  } catch (error) {
    console.error(`Error triggering workflow ${workflowKey}:`, error)
    return false
  }
}

// Function to register a new n8n workflow webhook
export async function registerWorkflowWebhook(key: string, webhookUrl: string, secret: string, userId: string) {
  try {
    // Get the Supabase client
    const supabase = await createClient()

    // Check if the workflow webhook already exists
    const { data: existingWebhook, error: checkError } = await supabase
      .from("workflow_webhooks")
      .select("id")
      .eq("key", key)
      .single()

    if (existingWebhook) {
      // Update the existing webhook
      const { error } = await supabase
        .from("workflow_webhooks")
        .update({
          webhook_url: webhookUrl,
          secret: secret,
          updated_at: new Date().toISOString(),
          updated_by: userId,
        })
        .eq("id", existingWebhook.id)

      if (error) {
        console.error(`Error updating workflow webhook ${key}:`, error)
        return false
      }
    } else {
      // Create a new webhook
      const { error } = await supabase.from("workflow_webhooks").insert({
        key,
        webhook_url: webhookUrl,
        secret,
        created_by: userId,
        updated_by: userId,
      })

      if (error) {
        console.error(`Error creating workflow webhook ${key}:`, error)
        return false
      }
    }

    return true
  } catch (error) {
    console.error(`Error registering workflow webhook ${key}:`, error)
    return false
  }
}
