
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserRole } from "./types";

export const getUserRole = async (): Promise<UserRole> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    // Get user role from public.profiles
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (error || !data) {
      console.error("Error fetching user role:", error);
      return null;
    }
    
    return data.role as UserRole;
  } catch (error) {
    console.error("Error in getUserRole:", error);
    return null;
  }
};

export const handleSignIn = async (email: string, password: string, navigate: any) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error signing in:", error.message);
      toast.error(error.message);
      throw error;
    }

    toast.success("Inicio de sesión exitoso");
    navigate("/dashboard");
    return data;
  } catch (error) {
    console.error("Error in handleSignIn:", error);
    throw error;
  }
};

export const handleSignInWithGoogle = async () => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Error signing in with Google:", error.message);
      toast.error(error.message);
      throw error;
    }
  } catch (error) {
    console.error("Error in handleSignInWithGoogle:", error);
    toast.error("Error al iniciar sesión con Google");
    throw error;
  }
};

export const handleSignUp = async (email: string, password: string, name: string, onSuccess: (email: string, password: string) => Promise<void>) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      console.error("Error signing up:", error.message);
      toast.error(error.message);
      throw error;
    }

    // Create profile record
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        { 
          id: data.user?.id, 
          name, 
          email,
          role: 'client' 
        }
      ]);

    if (profileError) {
      console.error("Error creating profile:", profileError);
      toast.error("Error creating user profile");
      throw profileError;
    }

    toast.success("Registro exitoso. Iniciando sesión...");
    
    // Auto sign-in after successful registration
    await onSuccess(email, password);
    
    return data;
  } catch (error) {
    console.error("Error in handleSignUp:", error);
    throw error;
  }
};

export const handleSignOut = async (navigate: any) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error.message);
      toast.error(error.message);
      throw error;
    }

    toast.success("Sesión cerrada correctamente");
    navigate("/login");
  } catch (error) {
    console.error("Error in handleSignOut:", error);
    toast.error("Error al cerrar sesión");
    throw error;
  }
};

export const handleCreateTestUser = async (email: string, password: string, name: string, role: UserRole = "client") => {
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true
    });

    if (error) {
      console.error("Error creating test user:", error.message);
      toast.error(error.message);
      throw error;
    }

    if (data.user) {
      // Create profile record with role
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: data.user.id, 
            name, 
            email,
            role 
          }
        ]);

      if (profileError) {
        console.error("Error creating profile for test user:", profileError);
        toast.error("Error creating test user profile");
        throw profileError;
      }

      toast.success(`Test user (${role}) created successfully`);
    }

    return data;
  } catch (error) {
    console.error("Error in handleCreateTestUser:", error);
    throw error;
  }
};
