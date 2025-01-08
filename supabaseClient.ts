import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://obapdwkdvmugssuuhmko.supabase.co"; // Ensure these are correctly set
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iYXBkd2tkdm11Z3NzdXVobWtvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNjI5MjY2NiwiZXhwIjoyMDUxODY4NjY2fQ.VetcvuiBVHVNvfgrch1UK9w39MtLkdn9asawhNUktt4"; // Replace with your Supabase Anon Key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);