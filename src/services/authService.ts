
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Creates a test user account with specified credentials
 * @param email Email for the test user
 * @param password Password for the test user
 * @param name Name for the test user
 * @param role Role for the user (admin or client)
 * @returns Promise with the result of the operation
 */
export const createTestUser = async (
  email: string,
  password: string,
  name: string,
  role: "admin" | "client" = "client"
) => {
  try {
    console.log(`Creating test user with email: ${email} and role: ${role}`);
    
    // First check if the user already exists to avoid unnecessary API calls
    const { data: existingProfiles, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();
      
    if (existingProfiles) {
      console.log("Test user already exists in profiles, skipping creation");
      toast.success(`Usuario de prueba ya existe: ${email}`);
      return { user: existingProfiles };
    }
    
    // Check if the user exists in auth by trying to fetch profiles with the same email
    // Since we can't directly query auth.users, we rely on the profiles table
    const { data: allProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('email, id')
      .eq('email', email);
    
    if (allProfiles && allProfiles.length > 0) {
      console.log("Test user already exists in auth, skipping creation");
      toast.success(`Usuario de prueba ya existe: ${email}`);
      return { user: allProfiles[0] };
    }
    
    if (profileError && !profileError.message.includes('No rows found')) {
      console.error("Error checking for existing user in profiles:", profileError);
    }
    
    if (profilesError) {
      console.error("Error checking for existing users:", profilesError);
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role
        }
      }
    });

    if (error) {
      if (error.message.includes("rate limit") || error.status === 429) {
        console.error("Rate limit hit when creating test user:", error);
        toast.error(`Límite de peticiones alcanzado. Intenta de nuevo en unos minutos.`);
        throw Object.assign(error, { isRateLimit: true });
      } else {
        console.error("Error creating test user:", error);
        toast.error(`Error al crear usuario de prueba: ${error.message}`);
        throw error;
      }
    }
    
    console.log("Test user created successfully:", data);
    toast.success(`Usuario de prueba creado: ${email}`);
    return data;
  } catch (error: any) {
    console.error("Exception creating test user:", error);
    
    // Propagate the rate limit flag
    if (error.isRateLimit) {
      throw Object.assign(new Error(`Error de límite de peticiones: ${error.message}`), { isRateLimit: true });
    }
    
    toast.error(`Error inesperado: ${error.message}`);
    throw error;
  }
};

/**
 * Signs in a user with the specified credentials
 * @param email User email
 * @param password User password
 * @returns Promise with the sign in result
 */
export const signInUser = async (email: string, password: string) => {
  try {
    console.log(`Signing in user with email: ${email}`);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error("Sign in error:", error);
      toast.error(`Error al iniciar sesión: ${error.message}`);
      throw error;
    }
    
    console.log("Sign in successful:", data);
    toast.success("Inicio de sesión exitoso");
    return data;
  } catch (error: any) {
    console.error("Sign in exception:", error);
    toast.error(`Error inesperado: ${error.message}`);
    throw error;
  }
};
