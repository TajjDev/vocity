import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_URL
const supabaseApiKey = import.meta.env.VITE_API_KEY

export const supabase = createClient(supabaseUrl, supabaseApiKey);