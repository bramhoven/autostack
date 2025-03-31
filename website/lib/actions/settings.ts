"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export interface ServerGroup {
  id: string
  name: string
  description: string | null
  order_index: number
  servers: number[]
}

export interface UserSettings {
  theme: string
  auto_refresh: boolean
  refresh_interval: number
  show_offline_servers: boolean
  enable_notifications: boolean
  compact_view: boolean
  email_notifications: boolean
  server_alerts: boolean
  installation_updates: boolean
  security_alerts: boolean
  marketing_emails: boolean
}

// Update the getServerGroups function to handle empty results better
export async function getServerGroups() {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Get all server groups for the user
  const { data: groups, error: groupsError } = await supabase
    .from("server_groups")
    .select("*")
    .eq("user_id", session.user.id)
    .order("order_index")

  if (groupsError) {
    console.error("Error fetching server groups:", groupsError)
    throw new Error("Failed to fetch server groups")
  }

  if (!groups || groups.length === 0) {
    return []
  }

  // Get all server group members
  const { data: members, error: membersError } = await supabase
    .from("server_group_members")
    .select("*")
    .in(
      "group_id",
      groups.map((g) => g.id),
    )
    .order("order_index")

  if (membersError) {
    console.error("Error fetching server group members:", membersError)
    throw new Error("Failed to fetch server group members")
  }

  // Combine the data
  const serverGroups: ServerGroup[] = groups.map((group) => ({
    id: group.id,
    name: group.name,
    description: group.description,
    order_index: group.order_index,
    servers: members ? members.filter((m) => m.group_id === group.id).map((m) => m.server_id) : [],
  }))

  return serverGroups
}

// Update the getUnassignedServers function to handle empty results better
export async function getUnassignedServers() {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Get all servers for the user
  const { data: servers, error: serversError } = await supabase
    .from("servers")
    .select("id")
    .eq("user_id", session.user.id)

  if (serversError) {
    console.error("Error fetching servers:", serversError)
    throw new Error("Failed to fetch servers")
  }

  if (!servers || servers.length === 0) {
    return []
  }

  // Get all server group members
  const { data: members, error: membersError } = await supabase.from("server_group_members").select("server_id")

  if (membersError) {
    console.error("Error fetching server group members:", membersError)
    throw new Error("Failed to fetch server group members")
  }

  // Find servers that are not in any group
  const assignedServerIds = new Set(members ? members.map((m) => m.server_id) : [])
  const unassignedServers = servers.filter((s) => !assignedServerIds.has(s.id)).map((s) => s.id)

  return unassignedServers
}

export async function createServerGroup(data: { name: string; description: string | null }) {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Get the highest order_index
  const { data: maxOrder, error: maxOrderError } = await supabase
    .from("server_groups")
    .select("order_index")
    .eq("user_id", session.user.id)
    .order("order_index", { ascending: false })
    .limit(1)
    .single()

  const nextOrderIndex = maxOrderError ? 0 : (maxOrder?.order_index || 0) + 1

  // Insert the new group
  const { data: group, error } = await supabase
    .from("server_groups")
    .insert({
      user_id: session.user.id,
      name: data.name,
      description: data.description,
      order_index: nextOrderIndex,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating server group:", error)
    throw new Error("Failed to create server group")
  }

  revalidatePath("/settings")
  return group
}

export async function updateServerGroup(groupId: string, data: { name?: string; description?: string | null }) {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Update the group
  const { error } = await supabase
    .from("server_groups")
    .update({
      name: data.name,
      description: data.description,
    })
    .eq("id", groupId)
    .eq("user_id", session.user.id)

  if (error) {
    console.error("Error updating server group:", error)
    throw new Error("Failed to update server group")
  }

  revalidatePath("/settings")
  return { success: true }
}

export async function deleteServerGroup(groupId: string) {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Delete the group (members will be deleted via cascade)
  const { error } = await supabase.from("server_groups").delete().eq("id", groupId).eq("user_id", session.user.id)

  if (error) {
    console.error("Error deleting server group:", error)
    throw new Error("Failed to delete server group")
  }

  revalidatePath("/settings")
  return { success: true }
}

export async function updateServerGroupOrder(groupIds: string[]) {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Update each group's order_index
  const updates = groupIds.map((id, index) =>
    supabase.from("server_groups").update({ order_index: index }).eq("id", id).eq("user_id", session.user.id),
  )

  try {
    await Promise.all(updates)
    return { success: true }
  } catch (error) {
    console.error("Error updating server group order:", error)
    throw new Error("Failed to update server group order")
  }
}

export async function updateGroupServers(groupId: string, serverIds: number[]) {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // First, delete all existing members for this group
  const { error: deleteError } = await supabase.from("server_group_members").delete().eq("group_id", groupId)

  if (deleteError) {
    console.error("Error deleting server group members:", deleteError)
    throw new Error("Failed to update server group members")
  }

  // Then, insert the new members
  if (serverIds.length > 0) {
    const members = serverIds.map((serverId, index) => ({
      group_id: groupId,
      server_id: serverId,
      order_index: index,
    }))

    const { error: insertError } = await supabase.from("server_group_members").insert(members)

    if (insertError) {
      console.error("Error inserting server group members:", insertError)
      throw new Error("Failed to update server group members")
    }
  }

  revalidatePath("/settings")
  return { success: true }
}

export async function getUserSettings() {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Get user settings or create default if not exists
  const { data, error } = await supabase.from("user_settings").select("*").eq("user_id", session.user.id).single()

  if (error && error.code !== "PGRST116") {
    // PGRST116 is "no rows returned" error
    console.error("Error fetching user settings:", error)
    throw new Error("Failed to fetch user settings")
  }

  // Return default settings if none exist
  if (!data) {
    return {
      theme: "system",
      auto_refresh: true,
      refresh_interval: 30,
      show_offline_servers: true,
      enable_notifications: true,
      compact_view: false,
      email_notifications: true,
      server_alerts: true,
      installation_updates: true,
      security_alerts: true,
      marketing_emails: false,
    }
  }

  return {
    theme: data.theme,
    auto_refresh: data.auto_refresh,
    refresh_interval: data.refresh_interval,
    show_offline_servers: data.show_offline_servers,
    enable_notifications: data.enable_notifications,
    compact_view: data.compact_view,
    email_notifications: data.email_notifications,
    server_alerts: data.server_alerts,
    installation_updates: data.installation_updates,
    security_alerts: data.security_alerts,
    marketing_emails: data.marketing_emails,
  }
}

export async function updateGeneralSettings(settings: UserSettings) {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Check if settings exist
  const { data, error: checkError } = await supabase
    .from("user_settings")
    .select("user_id")
    .eq("user_id", session.user.id)
    .single()

  if (checkError && checkError.code !== "PGRST116") {
    console.error("Error checking user settings:", checkError)
    throw new Error("Failed to update user settings")
  }

  let error

  if (!data) {
    // Insert new settings
    const { error: insertError } = await supabase.from("user_settings").insert({
      user_id: session.user.id,
      theme: settings.theme,
      auto_refresh: settings.auto_refresh,
      refresh_interval: settings.refresh_interval,
      show_offline_servers: settings.show_offline_servers,
      enable_notifications: settings.enable_notifications,
      compact_view: settings.compact_view,
      updated_at: new Date().toISOString(),
      email_notifications: settings.email_notifications,
      server_alerts: settings.server_alerts,
      installation_updates: settings.installation_updates,
      security_alerts: settings.security_alerts,
      marketing_emails: settings.marketing_emails,
    })
    error = insertError
  } else {
    // Update existing settings
    const { error: updateError } = await supabase
      .from("user_settings")
      .update({
        theme: settings.theme,
        auto_refresh: settings.auto_refresh,
        refresh_interval: settings.refresh_interval,
        show_offline_servers: settings.show_offline_servers,
        enable_notifications: settings.enable_notifications,
        compact_view: settings.compact_view,
        updated_at: new Date().toISOString(),
        email_notifications: settings.email_notifications,
        server_alerts: settings.server_alerts,
        installation_updates: settings.installation_updates,
        security_alerts: settings.security_alerts,
        marketing_emails: settings.marketing_emails,
      })
      .eq("user_id", session.user.id)
    error = updateError
  }

  if (error) {
    console.error("Error updating user settings:", error)
    throw new Error("Failed to update user settings")
  }

  revalidatePath("/settings")
  return { success: true }
}

export async function createApiKey(data: { name: string; permissions: string[] }) {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error("Not authenticated")
  }

  // In a real app, you would create an API key in a database
  // This is a simplified version that returns a mock API key

  return `sk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
}

export async function deleteApiKey(keyId: string) {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error("Not authenticated")
  }

  // In a real app, you would delete the API key from a database
  // This is a simplified version that just returns success

  revalidatePath("/settings")

  return { success: true }
}

