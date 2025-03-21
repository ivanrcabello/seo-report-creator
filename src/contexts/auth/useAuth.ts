
import { useContext } from "react";
import { AuthContext } from "./context";

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    console.error("useAuth must be used within an AuthProvider");
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
}
