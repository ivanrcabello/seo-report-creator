
import { createContext } from "react";
import { Session, User } from "@supabase/supabase-js";
import { AuthContextType } from "./types";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
