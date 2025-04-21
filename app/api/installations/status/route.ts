import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { apiKeyAuth, hasPermission } from "@/lib/api-auth"
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
    if (!hasPermission(auth.permissions, "installations:update")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    try {
      // Get the status update data
      const data = await req.json()
      const { installation_id, status, error, logs } = data

      if (!installation_id || !status) {
        return NextResponse.json({ error: "Installation ID and status are required" }, { status: 400 })
      }

      // Get the Supabase client
      const supabase = await createClient()

      // Check if the installation exists and belongs to the user
      const { data: installation, error: installationError } = await supabase
        .from("installations")
        .select("id")
        .eq("id", installation_id)
        .eq("user_id", auth.userId)
        .single()

      if (installationError) {
        return NextResponse.json({ error: "Installation not found" }, { status: 404 })
      }

      // Update the installation status
      const updateData: any = { status }
      if (error) updateData.error = error
      if (logs) updateData.logs = logs

      const { error: updateError } = await supabase.from("installations").update(updateData).eq("id", installation_id)

      if (updateError) {
        console.error("Error updating installation status:", updateError)
        return NextResponse.json({ error: "Failed to update installation status" }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        installation_id,
        status,
      })
    } catch (error) {
      console.error("Error processing status update request:", error)
      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
  })
}
