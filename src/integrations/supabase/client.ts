
import { createClient } from "@supabase/supabase-js";

// Get environment variables or use demo values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Flag to track if we're using mock auth (when Supabase env vars are missing)
export const isMockAuthEnabled = !supabaseUrl || !supabaseKey;

if (isMockAuthEnabled) {
  console.warn("⚠️ Using mock authentication - Supabase environment variables are missing!");
  console.info("For development only. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY for production use.");
} else if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables!");
  // Add more detailed error to help with debugging
  if (!supabaseUrl) console.error("VITE_SUPABASE_URL is missing");
  if (!supabaseKey) console.error("VITE_SUPABASE_ANON_KEY is missing");
}

// Always create the client, even with empty values - we'll handle this in auth context
export const supabase = createClient(supabaseUrl || "https://example.supabase.co", supabaseKey || "demo-key");

// Add debug function to check connection
export const checkSupabaseConnection = async () => {
  if (isMockAuthEnabled) {
    console.info("Mock auth is enabled, skipping Supabase connection check");
    return true;
  }
  
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
