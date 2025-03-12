
import { Card } from "@/components/ui/card";
import { TrendingUp, Globe, Search, BarChart2 } from "lucide-react";

export const DashboardSummary = () => {
  const metrics = [
    {
      title: "Puntuación SEO",
      value: "Pendiente",
      icon: TrendingUp,
      color: "text-emerald-500",
    },
    {
      title: "Visibilidad Web",
      value: "Pendiente",
      icon: Globe,
      color: "text-blue-500",
    },
    {
      title: "Keywords",
      value: "Pendiente",
      icon: Search,
      color: "text-purple-500",
    },
    {
      title: "Rendimiento",
      value: "Pendiente",
      icon: BarChart2,
      color: "text-amber-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full animate-fadeIn">
      {metrics.map((metric, index) => (
        <Card key={index} className="p-4 backdrop-blur-sm bg-white/50 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className={`rounded-full p-2 ${metric.color} bg-opacity-10`}>
              <metric.icon className={`w-5 h-5 ${metric.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{metric.title}</p>
              <p className="text-xl font-semibold text-gray-900">{metric.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
