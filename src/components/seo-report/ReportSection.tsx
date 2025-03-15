
import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface ReportSectionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
  titleColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
  borderColor?: string;
}

export const ReportSection = ({
  title,
  icon,
  children,
  className = "",
  titleColor = "text-gray-900",
  gradientFrom = "from-gray-50",
  gradientTo = "to-white",
  borderColor = "border-gray-200"
}: ReportSectionProps) => {
  return (
    <section className={`space-y-4 ${className}`}>
      <Card className={`border ${borderColor} bg-gradient-to-br ${gradientFrom} ${gradientTo}`}>
        <CardContent className="p-6">
          <h2 className={`text-2xl font-semibold ${titleColor} mb-4 flex items-center gap-2`}>
            {icon}
            {title}
          </h2>
          <div>{children}</div>
        </CardContent>
      </Card>
    </section>
  );
};
