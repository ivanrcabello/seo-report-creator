
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserProfileData } from "./types";

export function useUserProfile() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<UserProfileData>({
    name: "",
    email: user?.email || "",
    phone: "",
    company: "",
    website: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  // Load user profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        
        // Get profile data from clients table
        const { data, error } = await supabase
          .from('clients')
          .select('name, email, phone, company, website')
          .eq('id', user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          throw error;
        }
        
        if (data) {
          setProfileData({
            name: data.name || "",
            email: data.email || user.email || "",
            phone: data.phone || "",
            company: data.company || "",
            website: data.website || ""
          });
        }
      } catch (error) {
        console.error("Error loading profile data:", error);
        toast.error("Error al cargar los datos del perfil");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfileData();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('clients')
        .upsert({
          id: user.id,
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          company: profileData.company,
          website: profileData.website
        });
      
      if (error) {
        throw error;
      }
      
      toast.success("Perfil actualizado correctamente");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Error al guardar el perfil");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    profileData,
    isLoading,
    isSaving,
    showPasswordDialog,
    handleInputChange,
    handleSaveProfile,
    setShowPasswordDialog
  };
}
