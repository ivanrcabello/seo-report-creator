
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createTestUser, signInUser } from "@/services/authService";

type UserRole = "admin" | "client" | null;

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userRole: UserRole;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  createTestUser: (email: string, password: string, name: string, role?: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async (userId: string) => {
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
    };

    const setupUser = async (currentSession: Session | null) => {
      if (currentSession?.user) {
        setUser(currentSession.user);
        console.log("Setting up user:", currentSession.user.id);
        const role = await fetchUserRole(currentSession.user.id);
        console.log("Setting user role:", role);
        setUserRole(role);
      } else {
        setUser(null);
        setUserRole(null);
      }
      setIsLoading(false);
    };

    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log("Initial session:", initialSession);
      setSession(initialSession);
      setupUser(initialSession);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        console.log("Auth state changed:", _event, newSession?.user?.id);
        setSession(newSession);
        setupUser(newSession);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log("Attempting to sign in with:", email);
      await signInUser(email, password);
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Sign in exception:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
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
    } catch (error: any) {
      console.error("Google sign in exception:", error);
      toast.error(error.message || "Error al iniciar sesión con Google");
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
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
          await signIn(email, password);
        } catch (signInError) {
          console.error("Auto sign in failed after registration:", signInError);
        }
      }
    } catch (error: any) {
      console.error("Sign up exception:", error);
      toast.error(error.message || "Error al registrarse");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      navigate("/login");
      toast.success("Has cerrado sesión correctamente");
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast.error(error.message || "Error al cerrar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  const createTestUserAccount = async (email: string, password: string, name: string, role: UserRole = "client") => {
    try {
      setIsLoading(true);
      await createTestUser(email, password, name, role);
      toast.success("Usuario de prueba creado con éxito");
    } catch (error) {
      console.error("Error creating test user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = userRole === "admin";

  const value = {
    session,
    user,
    userRole,
    isLoading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    isAdmin,
    createTestUser: createTestUserAccount
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
