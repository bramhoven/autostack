"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Database } from "@/lib/supabase/database.types"

export type Server = Database["public"]["Tables"]["servers"]["Row"]

export async function getServers() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const { data, error } = await supabase.from("servers").select("*").eq("user_id", user.id).order("name")

  if (error) {
    console.error("Error fetching servers:", error)
    throw new Error("Failed to fetch servers")
  }

  return data as Server[]
}

export async function getServerById(id: number) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const { data, error } = await supabase.from("servers").select("*").eq("id", id).eq("user_id", user.id).single()

  if (error) {
    console.error(`Error fetching server with id ${id}:`, error)
    throw new Error("Failed to fetch server")
  }

  return data as Server
}

export async function createServer(server: Omit<Server, "id" | "user_id" | "created_at">) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const { data, error } = await supabase
    .from("servers")
    .insert({
      ...server,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating server:", error)
    throw new Error("Failed to create server")
  }

  revalidatePath("/servers")
  revalidatePath("/dashboard")

  return data as Server
}

export async function updateServer(id: number, server: Partial<Omit<Server, "id" | "user_id" | "created_at">>) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const { data, error } = await supabase
    .from("servers")
    .update(server)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    console.error(`Error updating server with id ${id}:`, error)
    throw new Error("Failed to update server")
  }

  revalidatePath("/servers")
  revalidatePath("/dashboard")
  revalidatePath(`/servers/${id}`)

  return data as Server
}

export async function deleteServer(id: number) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const { error } = await supabase.from("servers").delete().eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error(`Error deleting server with id ${id}:`, error)
    throw new Error("Failed to delete server")
  }

  revalidatePath("/servers")
  revalidatePath("/dashboard")

  return { success: true }
}
