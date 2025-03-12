
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  color: string;
  icon: React.ReactNode;
}

export const MetricCard = ({ title, value, description, color, icon, ...props }: MetricCardProps) => {
  return (
    <Card className={cn("relative overflow-hidden group hover:shadow-lg transition-all", props.className)}>
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
        </div>
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </div>
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity",
        "bg-gradient-to-r from-transparent via-white/5 to-transparent"
      )} />
    </Card>
  );
};
