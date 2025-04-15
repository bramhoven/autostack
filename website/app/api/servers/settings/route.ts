import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { apiKeyAuth, hasPermission } from "@/lib/api-auth"
// Import the withAuth helper
import { withAuth } from "@/lib/auth-utils"

// Update the GET function to use withAuth
export async function GET(req: NextRequest) {
  return withAuth(req, async (req, user) => {
    // Authenticate the request
    const auth = await apiKeyAuth(req)

    if (!auth.success) {
      return auth.response
    }

    // Check if the API key has the required permission
    if (!hasPermission(auth.permissions, "servers:read")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    try {
      // Get the server ID from the query parameters
      const searchParams = req.nextUrl.searchParams
      const serverId = searchParams.get("id")

      if (!serverId) {
        return NextResponse.json({ error: "Server ID is required" }, { status: 400 })
      }

      // Get the Supabase client
      const supabase = await createClient()

      // Get the server settings
      const { data: server, error } = await supabase
        .from("servers")
        .select("*")
        .eq("id", serverId)
        .eq("user_id", auth.userId)
        .single()

      if (error) {
        console.error("Error fetching server settings:", error)
        return NextResponse.json({ error: "Server not found" }, { status: 404 })
      }

      // Return the server settings
      return NextResponse.json({
        id: server.id,
        name: server.name,
        ip_address: server.ip_address,
        ssh_port: server.ssh_port,
        username: server.username,
        // Don't include sensitive information like SSH keys
        // Instead, provide a reference to the SSH key that n8n can use
        ssh_key_id: server.ssh_key_id,
      })
    } catch (error) {
      console.error("Error processing server settings request:", error)
      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
  })
}
