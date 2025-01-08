import { createClient } from "@supabase/supabase-js";

const supabaseu = process.env.NEXT_PUBLIC_SUPABASEURI || "";
const supabasesan = process.env.NEXT_PUBLIC_SUPABASEANONKEY || "";

const supabaseUrl = supabaseu; // Ensure these are correctly set
const supabaseAnonKey = supabasesan; // Replace with your Supabase Anon Key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);