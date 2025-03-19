
import { Session, User } from "@supabase/supabase-js";

export type UserRole = "admin" | "client" | "editor" | null;

export interface AuthContextType {
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
