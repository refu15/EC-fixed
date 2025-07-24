import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnon) {
  // eslint-disable-next-line no-console
  console.warn("Supabase env vars are not set. Falling back to undefined client.")
}

export const supabase = supabaseUrl && supabaseAnon ? createClient(supabaseUrl, supabaseAnon) : null
