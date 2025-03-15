
import { useAuth } from "@/contexts/AuthContext";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import { ClientDashboard } from "@/components/dashboard/ClientDashboard";
import { TestUserCreator } from "@/components/TestUserCreator";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function Dashboard() {
  const { isAdmin, userRole } = useAuth();
  const [hasAttemptedUserCreation, setHasAttemptedUserCreation] = useState(false);
  const [hasExistingTestUser, setHasExistingTestUser] = useState(false);
  const [isCheckingUser, setIsCheckingUser] = useState(true);

  // Safe date parsing helper
  const safeParseDate = (dateString: string | null): Date | null => {
    if (!dateString) return null;
    
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return null;
      }
      return date;
    } catch (e) {
      console.error("Invalid date format:", dateString);
      return null;
    }
  };

  // Check localStorage for whether we've hit rate limits recently
  useEffect(() => {
    const rateLimitUntil = localStorage.getItem('rateLimitUntil');
    if (rateLimitUntil) {
      const rateLimitTime = parseInt(rateLimitUntil, 10);
      if (!isNaN(rateLimitTime) && Date.now() < rateLimitTime) {
        // Still in rate limit period, don't try to create users
        console.log("Rate limit period active, skipping test user creation");
        setHasAttemptedUserCreation(true);
      } else {
        // Rate limit period has passed, clear it
        console.log("Rate limit period expired, clearing");
        localStorage.removeItem('rateLimitUntil');
      }
    }
  }, []);

  // Check if test user already exists
  useEffect(() => {
    const checkExistingUser = async () => {
      if (isAdmin && !hasAttemptedUserCreation && !hasExistingTestUser) {
        try {
          setIsCheckingUser(true);
          console.log("Checking if test user exists...");
          
          const { data, error } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', 'ivan@repararelpc.es')
            .maybeSingle();
            
          if (data) {
            console.log("Test user already exists, skipping creation");
            setHasExistingTestUser(true);
            setHasAttemptedUserCreation(true);
          } else {
            console.log("Test user does not exist");
            // Only mark as "not existing" if we're sure
            if (error && error.message.includes('No rows found')) {
              setHasExistingTestUser(false);
            }
          }
          
          if (error && !error.message.includes('No rows found')) {
            console.error("Error checking for existing user:", error);
            // If there's an error (other than "no rows"), err on the side of caution
            setHasAttemptedUserCreation(true);
          }
        } catch (error) {
          console.error("Exception checking for existing user:", error);
          setHasAttemptedUserCreation(true);
        } finally {
          setIsCheckingUser(false);
        }
      }
    };
    
    checkExistingUser();
  }, [isAdmin, hasAttemptedUserCreation, hasExistingTestUser]);

  // Handler for rate limit errors in test user creation
  const handleRateLimitError = () => {
    console.log("Rate limit hit, disabling test user creation for 10 minutes");
    // Set a 10 minute rate limit window
    const tenMinutesFromNow = Date.now() + (10 * 60 * 1000); 
    localStorage.setItem('rateLimitUntil', tenMinutesFromNow.toString());
    toast.error("Limite de peticiones alcanzado. Intenta de nuevo en unos minutos.");
    setHasAttemptedUserCreation(true);
  };

  // Don't render the TestUserCreator until we've completed the check
  if (isCheckingUser) {
    return (
      <div className="container mx-auto py-6">
        {isAdmin ? <AdminDashboard /> : <ClientDashboard />}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      {isAdmin && !hasAttemptedUserCreation && !hasExistingTestUser && (
        <TestUserCreator
          email="ivan@repararelpc.es"
          password="6126219271"
          name="Cliente de Prueba"
          role="client"
          autoCreate={true}
          onRateLimitError={handleRateLimitError}
          onSuccess={() => {
            console.log("Test user created successfully");
            setHasAttemptedUserCreation(true);
            setHasExistingTestUser(true);
          }}
        />
      )}
      
      {isAdmin ? <AdminDashboard /> : <ClientDashboard />}
    </div>
  );
}
