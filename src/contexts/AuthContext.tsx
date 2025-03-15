
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
      const { data, error } = await supabase
        .rpc('get_user_role')
        .single();
      
      if (error) {
        console.error("Error fetching user role:", error);
        return null;
      }
      
      return data as UserRole;
    };

    const setupUser = async (currentSession: Session | null) => {
      if (currentSession?.user) {
        setUser(currentSession.user);
        const role = await fetchUserRole(currentSession.user.id);
        setUserRole(role);
      } else {
        setUser(null);
        setUserRole(null);
      }
      setIsLoading(false);
    };

    // Initial session fetch
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setupUser(initialSession);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
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
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      toast.success("Inicio de sesión exitoso");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Error al iniciar sesión");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard'
        }
      });
      
      if (error) throw error;
      
    } catch (error: any) {
      toast.error(error.message || "Error al iniciar sesión con Google");
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: { name }
        }
      });
      
      if (error) throw error;
      
      toast.success("Registro exitoso. Por favor verifica tu correo electrónico.");
    } catch (error: any) {
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
      toast.error(error.message || "Error al cerrar sesión");
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
    isAdmin
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
