
import { MapPin, Store, Star, Globe, Phone, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LocalSeoOverviewProps {
  clientId: string;
  businessName: string;
  address: string;
  phone?: string;
  website?: string;
  googleBusinessUrl?: string;
  googleMapsRanking?: number;
  googleReviewsCount?: number;
  googleReviewsAverage?: number;
  listingsCount?: number;
  targetLocations?: string[];
  recommendations?: string[];
}

export const LocalSeoOverview = ({
  clientId,
  businessName,
  address,
  phone,
  website,
  googleBusinessUrl,
  googleMapsRanking,
  googleReviewsCount,
  googleReviewsAverage,
  listingsCount,
  targetLocations,
  recommendations
}: LocalSeoOverviewProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4 border">
          <h3 className="text-md font-medium mb-3 flex items-center gap-2">
            <Store className="h-4 w-4" />
            Negocio
          </h3>
          <p className="text-lg font-semibold">{businessName}</p>
          <p className="text-gray-600">{address}</p>
          
          <div className="mt-3 space-y-1">
            {phone && (
              <p className="text-gray-600 text-sm flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-gray-400" />
                {phone}
              </p>
            )}
            
            {website && (
              <p className="text-gray-600 text-sm flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-gray-400" />
                <a href={website.startsWith('http') ? website : `https://${website}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline truncate max-w-[180px]">
                  {website.replace(/^https?:\/\//, '')}
                </a>
              </p>
            )}
            
            {googleBusinessUrl && (
              <p className="text-gray-600 text-sm flex items-center gap-1.5">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Google_My_Business_Logo.svg/512px-Google_My_Business_Logo.svg.png" 
                  alt="Google My Business" 
                  className="h-3.5 w-3.5" 
                />
                <a href={googleBusinessUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline">
                  Perfil de Google Business
                </a>
              </p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-50 rounded-lg p-4 border">
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Google Maps
            </h3>
            <div className="text-center">
              <span className="text-2xl font-bold text-blue-600">
                #{googleMapsRanking || "N/A"}
              </span>
              <p className="text-xs text-gray-600 mt-1">Posición</p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 border">
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Star className="h-4 w-4" />
              Reseñas
            </h3>
            <div className="text-center">
              <span className="text-2xl font-bold text-amber-500">
                {googleReviewsCount || "0"}
              </span>
              <p className="text-xs text-gray-600 mt-1">Total</p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 border">
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Star className="h-4 w-4" />
              Puntuación
            </h3>
            <div className="text-center">
              <div className="flex items-center justify-center">
                <span className="text-2xl font-bold text-amber-500 mr-1">
                  {(googleReviewsAverage !== undefined && googleReviewsAverage !== null) 
                    ? Number(googleReviewsAverage).toFixed(1) 
                    : "0.0"}
                </span>
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              </div>
              <p className="text-xs text-gray-600 mt-1">Promedio</p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 border">
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Directorios
            </h3>
            <div className="text-center">
              <span className="text-2xl font-bold text-indigo-500">
                {listingsCount || "0"}
              </span>
              <p className="text-xs text-gray-600 mt-1">Listados</p>
            </div>
          </div>
        </div>
      </div>
      
      {targetLocations && targetLocations.length > 0 && (
        <div className="bg-white rounded-lg p-4 border">
          <h3 className="text-md font-medium mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Ubicaciones objetivo
          </h3>
          <div className="flex flex-wrap gap-2">
            {targetLocations.map((location: string, index: number) => (
              <Badge key={index} variant="outline" className="py-1">
                <MapPin className="h-3 w-3 mr-1" />
                {location}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {recommendations && recommendations.length > 0 && (
        <div className="bg-white rounded-lg p-4 border">
          <h3 className="text-md font-medium mb-4 flex items-center gap-2">
            <Award className="h-4 w-4" />
            Recomendaciones
          </h3>
          <ul className="list-disc pl-5 space-y-2">
            {recommendations.map((rec: string, index: number) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
