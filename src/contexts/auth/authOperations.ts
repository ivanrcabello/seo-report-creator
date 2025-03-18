
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserRole } from "./types";
import { NavigateFunction } from "react-router-dom";

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

// Funciones para la autenticación
export const fetchUserRole = async (userId: string) => {
  try {
    console.log("Fetching user role from database for user:", userId);
    const { data, error } = await supabase.rpc('get_user_role');

    if (error) {
      console.error("Get user role error:", error);
      throw error;
    }

    console.log("User role:", data);
    return data;
  } catch (error: any) {
    console.error("Exception in fetchUserRole:", error);
    return null;
  }
};

export const handleSignIn = async (email: string, password: string, navigate: NavigateFunction) => {
  try {
    console.log("Attempting to sign in with email:", email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Sign in error:", error);
      
      // Mensajes de error más amigables
      if (error.message.includes("Invalid login credentials")) {
        toast.error("Credenciales incorrectas. Verifica tu email y contraseña.");
      } else {
        toast.error("Error al iniciar sesión: " + error.message);
      }
      
      throw error;
    }

    console.log("Successfully signed in:", data);
    navigate("/dashboard");
    return data;
  } catch (error) {
    throw error;
  }
};

export const handleSignInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard',
      },
    });

    if (error) {
      console.error("Google sign in error:", error);
      toast.error("Error al iniciar sesión con Google: " + error.message);
      throw error;
    }

    console.log("Redirecting to Google OAuth:", data);
    return data;
  } catch (error) {
    console.error("Exception in handleSignInWithGoogle:", error);
    throw error;
  }
};

export const handleSignUp = async (
  email: string, 
  password: string, 
  name: string, 
  signInFunction: (email: string, password: string) => Promise<void>
) => {
  try {
    console.log("Attempting to sign up with email:", email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: "client"
        },
      },
    });

    if (error) {
      console.error("Sign up error:", error);
      
      // Mensajes de error más amigables
      if (error.message.includes("already registered")) {
        toast.error("Este email ya está registrado. Prueba con otro o inicia sesión.");
      } else {
        toast.error("Error al crear la cuenta: " + error.message);
      }
      
      throw error;
    }

    console.log("Successfully signed up:", data);
    
    if (data.session) {
      // Si hay sesión, el usuario está autenticado inmediatamente
      toast.success("Cuenta creada correctamente. ¡Bienvenido!");
    } else {
      // Si no hay sesión, probablemente se requiere verificación por correo
      toast.success("Cuenta creada. Por favor, verifica tu email para activarla.");
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

export const handleSignOut = async (navigate: NavigateFunction) => {
  try {
    console.log("Attempting to sign out");
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign out error:", error);
      toast.error("Error al cerrar sesión: " + error.message);
      throw error;
    }

    console.log("Successfully signed out");
    navigate("/login");
  } catch (error: any) {
    console.error("Exception in signOut:", error);
    throw error;
  }
};

export const handleCreateTestUser = async (email: string, password: string, name: string, role: UserRole = "client") => {
  try {
    console.log(`Creating test user with email: ${email} and role: ${role}`);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role
        },
      },
    });

    if (error) {
      console.error("Create test user error:", error);
      toast.error("Error al crear usuario de prueba: " + error.message);
      throw error;
    }

    console.log("Successfully created test user:", data);
    toast.success(`Usuario de prueba creado: ${email} (${role})`);
    return data;
  } catch (error: any) {
    console.error("Exception in createTestUser:", error);
    throw error;
  }
};
