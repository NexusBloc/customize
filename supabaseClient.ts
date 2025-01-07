import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fzuciewfxtpdcchukjfj.supabase.co"; // Replace with your Supabase URL
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6dWNpZXdmeHRwZGNjaHVramZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyMDIxOTIsImV4cCI6MjA1MTc3ODE5Mn0.imq0r_jEVmdNxzuEhkTB5JrjjeLc5AAOpyo2OZ01-2o"; // Replace with your Supabase Anon Key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
