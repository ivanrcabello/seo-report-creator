
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Lock, Save } from "lucide-react";
import { ProfileForm } from "./profile/ProfileForm";
import { PasswordChangeDialog } from "./profile/PasswordChangeDialog";
import { useUserProfile } from "./profile/useUserProfile";

export function UserProfile() {
  const {
    profileData,
    isLoading,
    isSaving,
    showPasswordDialog,
    handleInputChange,
    handleSaveProfile,
    setShowPasswordDialog
  } = useUserProfile();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-500" />
            Perfil de usuario
          </CardTitle>
          <CardDescription>
            Actualiza tu información personal y preferencias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ProfileForm 
              profileData={profileData}
              handleInputChange={handleInputChange}
              isLoading={isLoading}
            />
            
            <div className="pt-4 flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setShowPasswordDialog(true)}
                className="gap-1"
              >
                <Lock className="h-4 w-4" />
                Cambiar contraseña
              </Button>
              
              <Button 
                onClick={handleSaveProfile} 
                disabled={isSaving || isLoading}
                className="gap-1"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <PasswordChangeDialog 
        open={showPasswordDialog} 
        onOpenChange={setShowPasswordDialog} 
      />
    </>
  );
}
