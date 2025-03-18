
import { ReactNode } from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { 
  BarChart2, 
  TrendingUp, 
  MessageSquare, 
  User, 
  FileText, 
  FileSpreadsheet, 
  FileSignature, 
  MailOpen 
} from "lucide-react";

export interface DashboardTab {
  value: string;
  label: string;
  icon: ReactNode;
  path: string; // Add path for correct navigation
}

export const dashboardTabs: DashboardTab[] = [
  {
    value: "dashboard",
    label: "Dashboard",
    icon: <BarChart2 className="h-4 w-4" />,
    path: "/dashboard"
  },
  {
    value: "reports",
    label: "Informes",
    icon: <FileText className="h-4 w-4" />,
    path: "/reports"
  },
  {
    value: "proposals",
    label: "Propuestas",
    icon: <MailOpen className="h-4 w-4" />,
    path: "/proposals"
  },
  {
    value: "contracts",
    label: "Contratos",
    icon: <FileSignature className="h-4 w-4" />,
    path: "/contracts"
  },
  {
    value: "invoices",
    label: "Facturas",
    icon: <FileSpreadsheet className="h-4 w-4" />,
    path: "/invoices"
  },
  {
    value: "documents",
    label: "Documentos",
    icon: <FileText className="h-4 w-4" />,
    path: "/documents"
  },
  {
    value: "support",
    label: "Soporte",
    icon: <MessageSquare className="h-4 w-4" />,
    path: "/tickets"
  },
  {
    value: "profile",
    label: "Perfil",
    icon: <User className="h-4 w-4" />,
    path: "/profile"
  }
];

interface DashboardTabsProps {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export function DashboardTabs({ defaultValue = "dashboard", onValueChange }: DashboardTabsProps) {
  return (
    <TabsList className="mb-8">
      {dashboardTabs.map((tab) => (
        <Link to={tab.path} key={tab.value}>
          <TabsTrigger 
            value={tab.value} 
            className="flex items-center gap-1"
            onClick={() => onValueChange && onValueChange(tab.value)}
          >
            {tab.icon}
            {tab.label}
          </TabsTrigger>
        </Link>
      ))}
    </TabsList>
  );
}
