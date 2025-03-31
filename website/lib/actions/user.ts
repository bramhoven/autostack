"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface UserProfileData {
  name?: string
  avatar_url?: string
}

export async function updateUserProfile(data: UserProfileData) {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error("Not authenticated")
  }

  const { error } = await supabase.auth.updateUser({
    data: {
      name: data.name,
      avatar_url: data.avatar_url,
    },
  })

  if (error) {
    console.error("Error updating user profile:", error)
    throw new Error("Failed to update user profile")
  }

  revalidatePath("/account")
  revalidatePath("/profile")

  return { success: true }
}

interface PasswordData {
  currentPassword: string
  newPassword: string
}

export async function updateUserPassword(data: PasswordData) {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error("Not authenticated")
  }

  // In a real app, you would verify the current password first
  // This is a simplified version

  const { error } = await supabase.auth.updateUser({
    password: data.newPassword,
  })

  if (error) {
    console.error("Error updating user password:", error)
    throw new Error("Failed to update password")
  }

  return { success: true }
}

interface NotificationSettings {
  enable_notifications: boolean
  email_notifications: boolean
  server_alerts: boolean
  installation_updates: boolean
  security_alerts: boolean
  marketing_emails: boolean
}

export async function updateNotificationSettings(settings: NotificationSettings) {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error("Not authenticated")
  }

  // Check if user_settings record exists
  const { data: existingSettings, error: checkError } = await supabase
    .from("user_settings")
    .select("user_id")
    .eq("user_id", session.user.id)
    .single()

  if (checkError && checkError.code !== "PGRST116") {
    console.error("Error checking user settings:", checkError)
    throw new Error("Failed to update notification settings")
  }

  // Prepare the settings data
  const settingsData = {
    enable_notifications: settings.enable_notifications,
    email_notifications: settings.email_notifications,
    server_alerts: settings.server_alerts,
    installation_updates: settings.installation_updates,
    security_alerts: settings.security_alerts,
    marketing_emails: settings.marketing_emails,
    updated_at: new Date().toISOString(),
  }

  let error

  if (!existingSettings) {
    // Insert new settings
    const { error: insertError } = await supabase.from("user_settings").insert({
      user_id: session.user.id,
      ...settingsData,
    })
    error = insertError
  } else {
    // Update existing settings
    const { error: updateError } = await supabase
      .from("user_settings")
      .update(settingsData)
      .eq("user_id", session.user.id)
    error = updateError
  }

  if (error) {
    console.error("Error updating notification settings:", error)
    throw new Error("Failed to update notification settings")
  }

  revalidatePath("/account")

  return { success: true }
}

