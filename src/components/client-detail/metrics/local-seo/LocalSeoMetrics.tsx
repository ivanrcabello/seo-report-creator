
import { useState } from "react";
import { MetricsCard } from "../MetricsCard";
import { MapPin, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocalSeoData } from "./useLocalSeoData";
import { LocalSeoOverview } from "./LocalSeoOverview";
import { LocalSeoSettings } from "./LocalSeoSettings";
import { LocalSeoHistory } from "./LocalSeoHistory";
import { LocalSeoKeywords } from "./LocalSeoKeywords";

interface LocalSeoMetricsProps {
  clientId: string;
  clientName: string;
}

export const LocalSeoMetrics = ({ clientId, clientName }: LocalSeoMetricsProps) => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  const { 
    isLoading, 
    isRefreshing, 
    refreshData, 
    currentReport,
    metricHistory,
    localSeoSettings
  } = useLocalSeoData(clientId);
  
  if (isLoading) {
    return (
      <MetricsCard 
        title="SEO Local" 
        icon={<MapPin className="h-5 w-5 text-seo-blue" />}
      >
        <div className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </MetricsCard>
    );
  }
  
  // Extract data from current report or settings to pass to the overview
  const businessName = currentReport?.businessName || localSeoSettings?.business_name;
  const address = currentReport?.address || localSeoSettings?.address;
  const phone = currentReport?.phone || localSeoSettings?.phone;
  const website = currentReport?.website || localSeoSettings?.website;
  const googleBusinessUrl = currentReport?.googleBusinessUrl || localSeoSettings?.google_business_url;
  const googleMapsRanking = currentReport?.googleMapsRanking || localSeoSettings?.google_maps_ranking;
  const googleReviewsCount = currentReport?.googleReviewsCount || localSeoSettings?.google_reviews_count;
  const googleReviewsAverage = currentReport?.googleReviewsAverage || localSeoSettings?.google_reviews_average;
  const listingsCount = localSeoSettings?.listings_count;
  const targetLocations = localSeoSettings?.target_locations;
  const recommendations = currentReport?.recommendations;
  
  return (
    <>
      <MetricsCard 
        title="SEO Local" 
        icon={<MapPin className="h-5 w-5 text-seo-blue" />}
        action={
          <Button 
            size="sm" 
            variant="outline" 
            onClick={refreshData}
            disabled={isRefreshing}
          >
            <RefreshCcw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        }
      >
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Visión General</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
            {metricHistory.length > 0 && (
              <TabsTrigger value="history">Historial</TabsTrigger>
            )}
            {currentReport?.keywordRankings && currentReport.keywordRankings.length > 0 && (
              <TabsTrigger value="keywords">Palabras Clave</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="overview">
            <LocalSeoOverview 
              clientId={clientId} 
              clientName={clientName}
              businessName={businessName}
              address={address}
              phone={phone}
              website={website}
              googleBusinessUrl={googleBusinessUrl}
              googleMapsRanking={googleMapsRanking}
              googleReviewsCount={googleReviewsCount}
              googleReviewsAverage={googleReviewsAverage}
              listingsCount={listingsCount}
              targetLocations={targetLocations}
              recommendations={recommendations}
            />
          </TabsContent>
          
          <TabsContent value="settings">
            <LocalSeoSettings clientId={clientId} clientName={clientName} />
          </TabsContent>
          
          <TabsContent value="history">
            <LocalSeoHistory clientId={clientId} />
          </TabsContent>
          
          <TabsContent value="keywords">
            <LocalSeoKeywords clientId={clientId} />
          </TabsContent>
        </Tabs>
      </MetricsCard>
    </>
  );
};
