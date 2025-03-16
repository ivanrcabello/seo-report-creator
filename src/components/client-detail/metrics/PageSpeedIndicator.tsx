
import { CircleCheck, CircleAlert, CircleX } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageSpeedIndicatorProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export const PageSpeedIndicator = ({ 
  score, 
  size = "md", 
  showLabel = false,
  className 
}: PageSpeedIndicatorProps) => {
  // Default scores based on PageSpeed Insights thresholds
  const isGood = score >= 90;
  const isAverage = score >= 50 && score < 90;
  const isBad = score < 50;
  
  // Calculate sizes based on the size prop
  const iconSize = size === "sm" ? 16 : size === "md" ? 20 : 24;
  const textSize = size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base";
  
  // Determine the color and icon based on the score
  const scoreColor = isGood ? "text-green-500" : isAverage ? "text-amber-500" : "text-red-500";
  const bgColor = isGood ? "bg-green-50" : isAverage ? "bg-amber-50" : "bg-red-50";
  
  const Icon = isGood ? CircleCheck : isAverage ? CircleAlert : CircleX;
  
  // Get the label text
  const labelText = isGood ? "Bueno" : isAverage ? "Mejorable" : "Malo";
  
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className={cn("p-1 rounded-full", bgColor)}>
        <Icon className={cn(scoreColor)} size={iconSize} />
      </div>
      
      <div className="flex flex-col">
        <span className={cn("font-medium", scoreColor, textSize)}>{score}</span>
        {showLabel && (
          <span className={cn("text-gray-500", size === "sm" ? "text-xs" : "text-sm")}>
            {labelText}
          </span>
        )}
      </div>
    </div>
  );
};
