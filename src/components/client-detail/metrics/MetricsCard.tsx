
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MetricsCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}

export const MetricsCard = ({ title, children, className, icon }: MetricsCardProps) => {
  return (
    <Card className={cn("shadow-md border-0", className)}>
      <CardHeader className="bg-gradient-to-r from-white to-gray-50 border-b">
        <CardTitle className="text-xl flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {children}
      </CardContent>
    </Card>
  );
};
