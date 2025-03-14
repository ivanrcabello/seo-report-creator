
import { Progress } from "@/components/ui/progress";

// Sample usage data
const usageData = [
  { client: "Empresa A", reports: 8, proposals: 3, percentage: 85 },
  { client: "Comercio B", reports: 5, proposals: 2, percentage: 65 },
  { client: "Servicio C", reports: 12, proposals: 4, percentage: 92 },
  { client: "Tienda D", reports: 4, proposals: 1, percentage: 45 },
];

export const UsageMetrics = () => {
  return (
    <div className="space-y-5">
      {usageData.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{item.client}</span>
            <span className="text-gray-500">{item.percentage}%</span>
          </div>
          <div className="flex text-xs text-gray-500 justify-between mb-1.5">
            <span>{item.reports} informes</span>
            <span>{item.proposals} propuestas</span>
          </div>
          <Progress 
            value={item.percentage} 
            className="h-2"
          />
        </div>
      ))}
    </div>
  );
};
