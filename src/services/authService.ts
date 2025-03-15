
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
      console.error("Error creating test user:", error);
      toast.error(`Error al crear usuario de prueba: ${error.message}`);
      throw error;
    }
    
    console.log("Test user created successfully:", data);
    toast.success(`Usuario de prueba creado: ${email}`);
    return data;
  } catch (error: any) {
    console.error("Exception creating test user:", error);
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
