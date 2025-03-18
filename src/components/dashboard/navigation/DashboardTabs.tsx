
import { ReactNode } from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
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
import { useAuth } from "@/contexts/auth";

export interface DashboardTab {
  value: string;
  label: string;
  icon: ReactNode;
  path: string; // Add path for correct navigation
  adminOnly?: boolean;
}

export const dashboardTabs: DashboardTab[] = [
  {
    value: "dashboard",
    label: "Dashboard",
    icon: <BarChart2 className="h-4 w-4" />,
    path: "/dashboard"
  },
  {
    value: "clients",
    label: "Clientes",
    icon: <User className="h-4 w-4" />,
    path: "/clients",
    adminOnly: true
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
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  // Filter tabs based on user role
  const filteredTabs = dashboardTabs.filter(tab => 
    !tab.adminOnly || (tab.adminOnly && isAdmin)
  );

  const handleTabClick = (tab: DashboardTab) => {
    if (onValueChange) {
      onValueChange(tab.value);
    }
    
    // For tab navigation, use query parameters
    if (tab.path === "/dashboard") {
      // Special case for dashboard itself
      navigate(tab.path);
    } else {
      // For other tabs, navigate to dashboard with tab query param
      navigate(`/dashboard?tab=${tab.value}`);
    }
  };

  return (
    <TabsList className="mb-8">
      {filteredTabs.map((tab) => (
        <TabsTrigger 
          key={tab.value}
          value={tab.value} 
          className="flex items-center gap-1"
          onClick={() => handleTabClick(tab)}
        >
          {tab.icon}
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
