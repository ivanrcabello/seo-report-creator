
import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: React.ReactNode;
  color: string;
}

export const StatCard = ({ 
  title, 
  value, 
  change, 
  trend = "neutral", 
  icon,
  color
}: StatCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className={cn("p-2 rounded-full", color)}>
            {icon}
          </div>
        </div>
        
        <div className="flex items-baseline">
          <p className="text-2xl font-bold">{value}</p>
          
          {change && (
            <div className={cn(
              "ml-2 flex items-center text-xs font-medium",
              trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-500"
            )}>
              {trend === "up" ? (
                <ArrowUp className="h-3 w-3 mr-1" />
              ) : trend === "down" ? (
                <ArrowDown className="h-3 w-3 mr-1" />
              ) : null}
              {change}
            </div>
          )}
        </div>
      </div>
      
      <div className={cn(
        "h-1 w-full",
        trend === "up" ? "bg-green-500" : 
        trend === "down" ? "bg-red-500" : 
        "bg-blue-500"
      )} />
    </Card>
  );
};
