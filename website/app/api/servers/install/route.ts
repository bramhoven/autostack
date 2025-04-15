import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { apiKeyAuth, hasPermission } from "@/lib/api-auth"
import { triggerWorkflow } from "@/lib/workflows"
// Import the withAuth helper
import { withAuth } from "@/lib/auth-utils"

// Update the POST function to use withAuth
export async function POST(req: NextRequest) {
  return withAuth(req, async (req, user) => {
    // Authenticate the request
    const auth = await apiKeyAuth(req)

    if (!auth.success) {
      return auth.response
    }

    // Check if the API key has the required permission
    if (!hasPermission(auth.permissions, "software:install")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    try {
      // Get the installation data
      const data = await req.json()
      const { server_id, software_id, version } = data

      if (!server_id || !software_id) {
        return NextResponse.json({ error: "Server ID and software ID are required" }, { status: 400 })
      }

      // Get the Supabase client
      const supabase = await createClient()

      // Check if the server belongs to the user
      const { data: server, error: serverError } = await supabase
        .from("servers")
        .select("id, name, ip_address, ssh_port, username")
        .eq("id", server_id)
        .eq("user_id", user.id)
        .single()

      if (serverError) {
        return NextResponse.json({ error: "Server not found" }, { status: 404 })
      }

      // Check if the software exists
      const { data: software, error: softwareError } = await supabase
        .from("software")
        .select("id, name, version")
        .eq("id", software_id)
        .single()

      if (softwareError) {
        return NextResponse.json({ error: "Software not found" }, { status: 404 })
      }

      // Create an installation record
      const { data: installation, error: installationError } = await supabase
        .from("installations")
        .insert({
          user_id: user.id,
          server_id: server_id,
          software_id: software_id,
          version: version || software.version,
          status: "pending",
        })
        .select()
        .single()

      if (installationError) {
        console.error("Error creating installation:", installationError)
        return NextResponse.json({ error: "Failed to create installation" }, { status: 500 })
      }

      // Trigger the n8n workflow to install the software
      const workflowData = {
        installation_id: installation.id,
        server: {
          id: server.id,
          name: server.name,
          ip_address: server.ip_address,
          ssh_port: server.ssh_port,
          username: server.username,
        },
        software: {
          id: software.id,
          name: software.name,
          version: version || software.version,
        },
        user_id: user.id,
      }

      const workflowSuccess = await triggerWorkflow("software_installation", workflowData)

      if (!workflowSuccess) {
        // Update the installation status to failed
        await supabase
          .from("installations")
          .update({ status: "failed", error: "Failed to trigger installation workflow" })
          .eq("id", installation.id)

        return NextResponse.json({ error: "Failed to trigger installation workflow" }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        installation_id: installation.id,
        status: "pending",
      })
    } catch (error) {
      console.error("Error processing installation request:", error)
      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
  })
}
