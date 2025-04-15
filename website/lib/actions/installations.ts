"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Database } from "@/lib/supabase/database.types"

export type Installation = Database["public"]["Tables"]["installations"]["Row"]

export async function getInstallations() {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error("Not authenticated")
  }

  const { data, error } = await supabase
    .from("installations")
    .select(`
      *,
      software:software_id (
        id,
        name,
        description,
        category,
        version,
        image_url
      ),
      server:server_id (
        id,
        name,
        ip_address
      )
    `)
    .eq("user_id", session.user.id)

  if (error) {
    console.error("Error fetching installations:", error)
    throw new Error("Failed to fetch installations")
  }

  return data
}

export async function getInstallationById(id: number) {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error("Not authenticated")
  }

  const { data, error } = await supabase
    .from("installations")
    .select(`
      *,
      software:software_id (
        id,
        name,
        description,
        category,
        version,
        image_url
      ),
      server:server_id (
        id,
        name,
        ip_address
      )
    `)
    .eq("id", id)
    .eq("user_id", session.user.id)
    .single()

  if (error) {
    console.error(`Error fetching installation with id ${id}:`, error)
    throw new Error("Failed to fetch installation")
  }

  return data
}

export async function createInstallation(installation: {
  server_id: number
  software_id: number
  version: string
}) {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error("Not authenticated")
  }

  const { data, error } = await supabase
    .from("installations")
    .insert({
      ...installation,
      user_id: session.user.id,
      status: "running",
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating installation:", error)
    throw new Error("Failed to create installation")
  }

  revalidatePath("/dashboard")

  return data as Installation
}

export async function updateInstallationStatus(id: number, status: string) {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error("Not authenticated")
  }

  const { data, error } = await supabase
    .from("installations")
    .update({ status })
    .eq("id", id)
    .eq("user_id", session.user.id)
    .select()
    .single()

  if (error) {
    console.error(`Error updating installation status with id ${id}:`, error)
    throw new Error("Failed to update installation status")
  }

  revalidatePath("/dashboard")

  return data as Installation
}

export async function deleteInstallation(id: number) {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error("Not authenticated")
  }

  const { error } = await supabase.from("installations").delete().eq("id", id).eq("user_id", session.user.id)

  if (error) {
    console.error(`Error deleting installation with id ${id}:`, error)
    throw new Error("Failed to delete installation")
  }

  revalidatePath("/dashboard")

  return { success: true }
}
