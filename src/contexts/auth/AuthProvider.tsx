
import { ReactNode, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthContext } from "./context";
import { UserRole } from "./types";
import { 
  getUserRole, 
  handleSignIn, 
  handleSignInWithGoogle, 
  handleSignUp,
  handleSignOut,
  handleCreateTestUser
} from "./authOperations";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const setupUser = async (currentSession: Session | null) => {
      if (currentSession?.user) {
        setUser(currentSession.user);
        console.log("Setting up user:", currentSession.user.id);
        const role = await getUserRole();
        console.log("Setting user role:", role);
        // Fix TypeScript error by properly converting string to UserRole
        setUserRole(role as UserRole);
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
      await handleSignIn(email, password, navigate);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      await handleSignInWithGoogle();
    } catch (error) {
      // Error is already handled in handleSignInWithGoogle
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      await handleSignUp(email, password, name, signIn);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await handleSignOut(navigate);
    } catch (error) {
      // Error is already handled in handleSignOut
    } finally {
      setIsLoading(false);
    }
  };

  const createTestUserAccount = async (email: string, password: string, name: string, role: UserRole = "client") => {
    try {
      setIsLoading(true);
      await handleCreateTestUser(email, password, name, role);
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
