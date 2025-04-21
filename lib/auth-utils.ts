import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { Database } from "@/lib/supabase/database.types"

export async function getAuthenticatedUser() {
  const cookieStore = cookies()

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set() {
          // We don't need to set cookies in this context
        },
        remove() {
          // We don't need to remove cookies in this context
        },
      },
    },
  )

  // First check if we have a session
  const { data: sessionData } = await supabase.auth.getSession()

  // If we have a session, verify the user
  if (sessionData.session) {
    const { data, error } = await supabase.auth.getUser()

    if (error) {
      return null
    }

    return data.user
  }

  return null
}

export async function withAuth(handler: Function) {
  return async (req: Request) => {
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return handler(req, user)
  }
}
