
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { createTestUser as createTestUserService, signInUser } from "@/services/authService";
import { UserRole } from "./types";

export async function fetchUserRole(userId: string) {
  try {
    const { data, error } = await supabase
      .rpc('get_user_role')
      .single();
    
    if (error) {
      console.error("Error fetching user role:", error);
      return null;
    }
    
    console.log("User role fetched:", data);
    return data as UserRole;
  } catch (error) {
    console.error("Exception fetching user role:", error);
    return null;
  }
}

export async function handleSignIn(email: string, password: string, navigate: (path: string) => void) {
  try {
    console.log("Attempting to sign in with:", email);
    await signInUser(email, password);
    navigate("/dashboard");
  } catch (error: any) {
    console.error("Sign in exception:", error);
    throw error;
  }
}

export async function handleSignInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard'
      }
    });
    
    if (error) {
      console.error("Google sign in error:", error);
      throw error;
    }
    
    console.log("Google sign in initiated:", data);
    return data;
  } catch (error: any) {
    console.error("Google sign in exception:", error);
    toast.error(error.message || "Error al iniciar sesión con Google");
    throw error;
  }
}

export async function handleSignUp(
  email: string, 
  password: string, 
  name: string,
  signInFn: (email: string, password: string) => Promise<void>
) {
  try {
    console.log("Attempting to sign up:", email);
    
    const { data: existingUser, error: checkError } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('email', email)
      .maybeSingle();
    
    if (checkError && !checkError.message.includes('No rows found')) {
      console.error("Error checking existing user:", checkError);
    }
    
    const adminEmails = ['ivan@soyseolocal.com', 'admin@example.com'];
    const role = adminEmails.includes(email.toLowerCase()) ? 'admin' : 'client';
    console.log(`Setting role for ${email} to ${role}`);
    
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
      console.error("Sign up error:", error);
      throw error;
    }
    
    if (existingUser) {
      if (existingUser.role !== role) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role })
          .eq('email', email);
          
        if (updateError) {
          console.error("Error updating existing user role:", updateError);
        }
      }
    }
    
    console.log("Sign up successful:", data);
    toast.success("Registro exitoso. Por favor verifica tu correo electrónico.");
    
    if (data.user) {
      try {
        await signInFn(email, password);
      } catch (signInError) {
        console.error("Auto sign in failed after registration:", signInError);
      }
    }
    
    return data;
  } catch (error: any) {
    console.error("Sign up exception:", error);
    toast.error(error.message || "Error al registrarse");
    throw error;
  }
}

export async function handleSignOut(navigate: (path: string) => void) {
  try {
    await supabase.auth.signOut();
    navigate("/login");
    toast.success("Has cerrado sesión correctamente");
  } catch (error: any) {
    console.error("Sign out error:", error);
    toast.error(error.message || "Error al cerrar sesión");
    throw error;
  }
}

export async function handleCreateTestUser(
  email: string, 
  password: string, 
  name: string, 
  role: UserRole = "client"
) {
  try {
    await createTestUserService(email, password, name, role);
    toast.success("Usuario de prueba creado con éxito");
  } catch (error) {
    console.error("Error creating test user:", error);
    throw error;
  }
}
