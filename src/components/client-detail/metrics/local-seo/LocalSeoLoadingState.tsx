
import { MetricsCard } from "../MetricsCard";
import { MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const LocalSeoLoadingState = () => {
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
};
