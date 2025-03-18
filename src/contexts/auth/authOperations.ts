
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const signIn = async (email: string, password: string) => {
  try {
    console.log("Attempting to sign in with email:", email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Sign in error:", error);
      throw error;
    }

    console.log("Successfully signed in:", data);
    return data;
  } catch (error: any) {
    console.error("Exception in signIn:", error);

    // Mensajes de error más amigables
    if (error.message.includes("Invalid login credentials")) {
      toast.error("Credenciales incorrectas. Verifica tu email y contraseña.");
    } else {
      toast.error("Error al iniciar sesión: " + error.message);
    }
    throw error;
  }
};

export const signUp = async (email: string, password: string, name: string, role?: string) => {
  try {
    console.log("Attempting to sign up with email:", email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: role || "client"
        },
      },
    });

    if (error) {
      console.error("Sign up error:", error);
      throw error;
    }

    console.log("Successfully signed up:", data);
    return data;
  } catch (error: any) {
    console.error("Exception in signUp:", error);
    
    // Mensajes de error más amigables
    if (error.message.includes("already registered")) {
      toast.error("Este email ya está registrado. Prueba con otro o inicia sesión.");
    } else {
      toast.error("Error al crear la cuenta: " + error.message);
    }
    throw error;
  }
};

export const signOut = async () => {
  try {
    console.log("Attempting to sign out");
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign out error:", error);
      throw error;
    }

    console.log("Successfully signed out");
  } catch (error: any) {
    console.error("Exception in signOut:", error);
    toast.error("Error al cerrar sesión: " + error.message);
    throw error;
  }
};

export const getUserRole = async () => {
  try {
    console.log("Fetching user role from database");
    const { data, error } = await supabase.rpc('get_user_role');

    if (error) {
      console.error("Get user role error:", error);
      throw error;
    }

    console.log("User role:", data);
    return data;
  } catch (error: any) {
    console.error("Exception in getUserRole:", error);
    return null;
  }
};

export const isUserAdmin = async () => {
  try {
    console.log("Checking if user is admin");
    const role = await getUserRole();
    const isAdmin = role === 'admin';
    console.log("Is user admin:", isAdmin);
    return isAdmin;
  } catch (error) {
    console.error("Exception in isUserAdmin:", error);
    return false;
  }
};
