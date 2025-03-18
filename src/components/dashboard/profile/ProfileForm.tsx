
import { User, Mail, Phone, Building, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserProfileData } from "./types";

interface ProfileFormProps {
  profileData: UserProfileData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
}

export function ProfileForm({ profileData, handleInputChange, isLoading }: ProfileFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center">
          <User className="h-4 w-4 mr-1 text-gray-500" />
          Nombre
        </Label>
        <Input
          id="name"
          name="name"
          value={profileData.name}
          onChange={handleInputChange}
          placeholder="Tu nombre"
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center">
          <Mail className="h-4 w-4 mr-1 text-gray-500" />
          Email
        </Label>
        <Input
          id="email"
          name="email"
          value={profileData.email}
          onChange={handleInputChange}
          placeholder="tu@email.com"
          disabled={true} // Email shouldn't be editable
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone" className="flex items-center">
          <Phone className="h-4 w-4 mr-1 text-gray-500" />
          Teléfono
        </Label>
        <Input
          id="phone"
          name="phone"
          value={profileData.phone}
          onChange={handleInputChange}
          placeholder="Tu número de teléfono"
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="company" className="flex items-center">
          <Building className="h-4 w-4 mr-1 text-gray-500" />
          Empresa
        </Label>
        <Input
          id="company"
          name="company"
          value={profileData.company}
          onChange={handleInputChange}
          placeholder="Nombre de tu empresa"
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="website" className="flex items-center">
          <Globe className="h-4 w-4 mr-1 text-gray-500" />
          Sitio web
        </Label>
        <Input
          id="website"
          name="website"
          value={profileData.website}
          onChange={handleInputChange}
          placeholder="https://tuempresa.com"
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
