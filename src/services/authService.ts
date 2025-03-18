
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logger from "@/services/advancedLogService";

// Logger específico para authService
const authServiceLogger = logger.getLogger('AuthService');

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
  authServiceLogger.info("Creando usuario de prueba", { 
    email, 
    role 
  });
  
  try {
    // First check if the user already exists to avoid unnecessary API calls
    const { data: existingProfiles, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();
      
    if (existingProfiles) {
      authServiceLogger.info("Usuario de prueba ya existe en profiles", { email });
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
      authServiceLogger.info("Usuario de prueba ya existe en auth", { email });
      toast.success(`Usuario de prueba ya existe: ${email}`);
      return { user: allProfiles[0] };
    }
    
    if (profileError && !profileError.message.includes('No rows found')) {
      authServiceLogger.error("Error verificando usuario existente en profiles", { 
        email, 
        error: profileError 
      });
    }
    
    if (profilesError) {
      authServiceLogger.error("Error verificando usuarios existentes", { 
        email, 
        error: profilesError 
      });
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
        authServiceLogger.error("Rate limit al crear usuario de prueba", { 
          email, 
          error 
        });
        toast.error(`Límite de peticiones alcanzado. Intenta de nuevo en unos minutos.`);
        throw Object.assign(error, { isRateLimit: true });
      } else {
        authServiceLogger.error("Error al crear usuario de prueba", { 
          email, 
          error 
        });
        toast.error(`Error al crear usuario de prueba: ${error.message}`);
        throw error;
      }
    }
    
    authServiceLogger.info("Usuario de prueba creado con éxito", { 
      email, 
      userId: data.user?.id 
    });
    toast.success(`Usuario de prueba creado: ${email}`);
    return data;
  } catch (error: any) {
    authServiceLogger.error("Excepción al crear usuario de prueba", { 
      email, 
      error
    });
    
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
  authServiceLogger.info("Iniciando sesión con email", { email });
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      authServiceLogger.error("Error en inicio de sesión", { 
        email, 
        error 
      });
      toast.error(`Error al iniciar sesión: ${error.message}`);
      throw error;
    }
    
    authServiceLogger.info("Inicio de sesión exitoso", { 
      email, 
      userId: data.user?.id 
    });
    toast.success("Inicio de sesión exitoso");
    return data;
  } catch (error: any) {
    authServiceLogger.error("Excepción en inicio de sesión", { 
      email, 
      error 
    });
    toast.error(`Error inesperado: ${error.message}`);
    throw error;
  }
};
