
import { Badge } from "@/components/ui/badge";
import { FileText, Users, Package, Mail, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

// Sample activity data
const activities = [
  {
    id: 1,
    type: "informe",
    description: "Informe SEO creado",
    time: "Hace 2 horas",
    icon: <FileText className="h-4 w-4" />,
    color: "bg-blue-100 text-blue-700"
  },
  {
    id: 2,
    type: "cliente",
    description: "Nuevo cliente añadido",
    time: "Hace 3 horas",
    icon: <Users className="h-4 w-4" />,
    color: "bg-green-100 text-green-700"
  },
  {
    id: 3,
    type: "paquete",
    description: "Paquete actualizado",
    time: "Hace 5 horas",
    icon: <Package className="h-4 w-4" />,
    color: "bg-amber-100 text-amber-700"
  },
  {
    id: 4,
    type: "propuesta",
    description: "Propuesta enviada",
    time: "Hace 1 día",
    icon: <Mail className="h-4 w-4" />,
    color: "bg-purple-100 text-purple-700"
  },
  {
    id: 5,
    type: "informe",
    description: "Informe visualizado",
    time: "Hace 1 día",
    icon: <Eye className="h-4 w-4" />,
    color: "bg-blue-100 text-blue-700"
  },
];

export const RecentActivity = () => {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-3">
          <div className={cn("rounded-full p-1.5 mt-0.5", activity.color)}>
            {activity.icon}
          </div>
          <div>
            <p className="text-sm font-medium">{activity.description}</p>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="outline" className="text-xs h-5 px-1.5 font-normal">
                {activity.type}
              </Badge>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
