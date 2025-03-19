
import { ReactNode, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { supabase, checkSupabaseConnection, isMockAuthEnabled } from "@/integrations/supabase/client";
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
import { toast } from "sonner";

interface AuthProviderProps {
  children: ReactNode;
}

// Mock user for development when Supabase is not configured
// Make sure it satisfies the User type from @supabase/supabase-js
const MOCK_USER: User = {
  id: "mock-user-id",
  email: "dev@example.com",
  app_metadata: {},
  user_metadata: { name: "Developer User" },
  aud: "authenticated",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  role: "",
  identities: []
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionChecked, setConnectionChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if using mock auth (development mode without Supabase)
    if (isMockAuthEnabled) {
      console.log("Using mock authentication for development");
      setTimeout(() => {
        setUser(MOCK_USER);
        setUserRole("admin");
        setIsLoading(false);
        setConnectionChecked(true);
      }, 500); // Simulate some loading time
      return;
    }
    
    // Normal Supabase auth flow
    checkSupabaseConnection()
      .then(connected => {
        setConnectionChecked(true);
        if (!connected) {
          console.error("Failed to connect to Supabase - check your environment variables");
          toast.error("Error connecting to the server");
        }
      });
      
    console.log("AuthProvider mounted");
    
    const setupUser = async (currentSession: Session | null) => {
      try {
        if (currentSession?.user) {
          setUser(currentSession.user);
          console.log("Setting up user:", currentSession.user.id);
          const role = await getUserRole();
          console.log("Setting user role:", role);
          setUserRole(role as UserRole);
        } else {
          console.log("No user session");
          setUser(null);
          setUserRole(null);
        }
      } catch (err) {
        console.error("Error in setupUser:", err);
      } finally {
        setIsLoading(false);
      }
    };

    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log("Initial session check:", initialSession ? "Found session" : "No session");
      setSession(initialSession);
      setupUser(initialSession);
    }).catch(err => {
      console.error("Error getting session:", err);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state changed:", event, newSession?.user?.id);
        setSession(newSession);
        setupUser(newSession);
      }
    );

    return () => {
      console.log("AuthProvider unmounting, unsubscribing from auth changes");
      subscription.unsubscribe();
    };
  }, []);

  // Update auth methods to support mock auth
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      if (isMockAuthEnabled) {
        // Mock sign in for development
        console.log("Mock sign in with:", email);
        toast.success("Mock sign in successful");
        setUser(MOCK_USER);
        setUserRole("admin");
        navigate("/dashboard");
        return;
      }
      
      await handleSignIn(email, password, navigate);
    } catch (error) {
      console.error("Sign in error in AuthProvider:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      
      if (isMockAuthEnabled) {
        // Mock Google sign in
        console.log("Mock Google sign in");
        toast.success("Mock Google sign in successful");
        setUser(MOCK_USER);
        setUserRole("admin");
        navigate("/dashboard");
        return;
      }
      
      await handleSignInWithGoogle();
    } catch (error) {
      console.error("Google sign in error in AuthProvider:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      
      if (isMockAuthEnabled) {
        // Mock sign up
        console.log("Mock sign up for:", email, name);
        toast.success("Mock sign up successful");
        setUser(MOCK_USER);
        setUserRole("client");
        navigate("/dashboard");
        return;
      }
      
      await handleSignUp(email, password, name, signIn);
    } catch (error) {
      console.error("Sign up error in AuthProvider:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      
      if (isMockAuthEnabled) {
        // Mock sign out
        console.log("Mock sign out");
        setUser(null);
        setUserRole(null);
        toast.success("Mock sign out successful");
        navigate("/login");
        return;
      }
      
      await handleSignOut(navigate);
    } catch (error) {
      console.error("Sign out error in AuthProvider:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createTestUserAccount = async (email: string, password: string, name: string, role: UserRole = "client") => {
    try {
      setIsLoading(true);
      
      if (isMockAuthEnabled) {
        // Mock test user creation
        console.log("Mock test user creation:", email, name, role);
        toast.success(`Mock test user created with role: ${role}`);
        return;
      }
      
      await handleCreateTestUser(email, password, name, role);
    } catch (error) {
      console.error("Error creating test user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = userRole === "admin";

  const contextValue = {
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

  // Only render children after connection has been checked
  return (
    <AuthContext.Provider value={contextValue}>
      {!connectionChecked ? (
        <div className="flex h-screen w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="ml-2">Connecting to server...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
