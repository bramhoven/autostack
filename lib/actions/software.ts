"use server"

import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/supabase/database.types"

export type Software = Database["public"]["Tables"]["software"]["Row"]

// Update the getSoftware function to work without authentication

export async function getSoftware() {
  const supabase = await createClient()

  // No authentication check needed for public software catalog
  const { data, error } = await supabase.from("software").select("*").order("name")

  if (error) {
    console.error("Error fetching software:", error)
    throw new Error("Failed to fetch software")
  }

  return data as Software[]
}

export async function getSoftwareById(id: number) {
  const supabase = await createClient()

  // No authentication check needed for public software details
  const { data, error } = await supabase.from("software").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching software with id ${id}:`, error)
    throw new Error("Failed to fetch software")
  }

  return data as Software
}

export async function getSoftwareByCategory(category: string) {
  const supabase = await createClient()

  // No authentication check needed for public software by category
  const { data, error } = await supabase.from("software").select("*").eq("category", category).order("name")

  if (error) {
    console.error(`Error fetching software with category ${category}:`, error)
    throw new Error("Failed to fetch software")
  }

  return data as Software[]
}
