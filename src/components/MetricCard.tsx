
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  color?: string;
  icon: ReactNode;
  className?: string;
  onClick?: () => void;
  target?: number;
  trend?: ReactNode;
  footer?: ReactNode;
}

export const MetricCard = ({ 
  title, 
  value, 
  description, 
  color = "bg-blue-50", 
  icon, 
  className,
  onClick,
  target,
  trend,
  footer
}: MetricCardProps) => {
  return (
    <Card 
      className={cn("relative overflow-hidden group hover:shadow-lg transition-all", className)}
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`rounded-full p-2 ${color}`}>
            {icon}
          </div>
          {description && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-[200px] text-sm">{description}</p>
              </TooltipContent>
            </Tooltip>
          )}
          {trend && (
            <div className="ml-auto">
              {trend}
            </div>
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <div className="flex items-end justify-between">
          <p className="text-3xl font-bold mt-2">{value}</p>
          {target && (
            <p className="text-sm text-gray-500">Meta: {target}</p>
          )}
        </div>
        {footer && (
          <div className="mt-4">
            {footer}
          </div>
        )}
      </div>
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity",
        "bg-gradient-to-r from-transparent via-white/5 to-transparent"
      )} />
    </Card>
  );
};
