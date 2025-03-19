
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables!");
  // Add more detailed error to help with debugging
  if (!supabaseUrl) console.error("VITE_SUPABASE_URL is missing");
  if (!supabaseKey) console.error("VITE_SUPABASE_ANON_KEY is missing");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Add debug function to check connection
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    console.log("Supabase connection check:", error ? "Failed" : "Successful");
    if (error) console.error("Supabase connection error:", error);
    return !error;
  } catch (err) {
    console.error("Failed to connect to Supabase:", err);
    return false;
  }
};
