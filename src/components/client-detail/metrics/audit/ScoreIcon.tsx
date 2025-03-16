
import { CircleCheck, CircleX, CircleDashed } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScoreIconProps {
  score: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const ScoreIcon = ({ score, size = "md", className }: ScoreIconProps) => {
  // Aseguramos que score es un número
  const numericScore = typeof score === 'string' ? parseFloat(score) : score;
  
  // Determine icon and color based on score
  let Icon;
  let colorClass;
  
  if (numericScore >= 0.9) {
    Icon = CircleCheck;
    colorClass = "text-green-500";
  } else if (numericScore >= 0.5) {
    Icon = CircleDashed;
    colorClass = "text-orange-500";
  } else {
    Icon = CircleX;
    colorClass = "text-red-500";
  }
  
  // Determine size based on prop
  const sizeClass = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  }[size];
  
  return <Icon className={cn(sizeClass, colorClass, className)} />;
};
