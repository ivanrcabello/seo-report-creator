
import { ReactNode } from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
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
}

export const dashboardTabs: DashboardTab[] = [
  {
    value: "dashboard",
    label: "Dashboard",
    icon: <BarChart2 className="h-4 w-4" />
  },
  {
    value: "reports",
    label: "Informes",
    icon: <FileText className="h-4 w-4" />
  },
  {
    value: "proposals",
    label: "Propuestas",
    icon: <MailOpen className="h-4 w-4" />
  },
  {
    value: "contracts",
    label: "Contratos",
    icon: <FileSignature className="h-4 w-4" />
  },
  {
    value: "invoices",
    label: "Facturas",
    icon: <FileSpreadsheet className="h-4 w-4" />
  },
  {
    value: "documents",
    label: "Documentos",
    icon: <FileText className="h-4 w-4" />
  },
  {
    value: "support",
    label: "Soporte",
    icon: <MessageSquare className="h-4 w-4" />
  },
  {
    value: "profile",
    label: "Perfil",
    icon: <User className="h-4 w-4" />
  }
];

interface DashboardTabsProps {
  defaultValue?: string;
}

export function DashboardTabs({ defaultValue = "dashboard" }: DashboardTabsProps) {
  return (
    <TabsList className="mb-8">
      {dashboardTabs.map((tab) => (
        <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-1">
          {tab.icon}
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
