
import { ReactNode } from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation, useNavigate } from "react-router-dom";
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
  path: string;
  adminOnly?: boolean;
  clientWriteAccess?: boolean; // Whether clients can create/edit in this section
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
    path: "/reports",
    clientWriteAccess: false
  },
  {
    value: "proposals",
    label: "Propuestas",
    icon: <MailOpen className="h-4 w-4" />,
    path: "/proposals",
    clientWriteAccess: false
  },
  {
    value: "contracts",
    label: "Contratos",
    icon: <FileSignature className="h-4 w-4" />,
    path: "/contracts",
    clientWriteAccess: false
  },
  {
    value: "invoices",
    label: "Facturas",
    icon: <FileSpreadsheet className="h-4 w-4" />,
    path: "/invoices",
    clientWriteAccess: false
  },
  {
    value: "documents",
    label: "Documentos",
    icon: <FileText className="h-4 w-4" />,
    path: "/documents"
  },
  {
    value: "tickets",
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
  const { isAdmin, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine the active tab from the URL
  const getActiveTabFromUrl = () => {
    const pathname = location.pathname;
    const queryParams = new URLSearchParams(location.search);
    const tabFromUrl = queryParams.get("tab");
    
    if (tabFromUrl) {
      return tabFromUrl;
    }
    
    // If no tab parameter, try to determine from path
    for (const tab of dashboardTabs) {
      if (pathname === tab.path || pathname.startsWith(`${tab.path}/`)) {
        return tab.value;
      }
    }
    
    return defaultValue;
  };

  // Filter tabs based on user role
  const filteredTabs = dashboardTabs.filter(tab => 
    !tab.adminOnly || (tab.adminOnly && isAdmin)
  );

  const activeTab = getActiveTabFromUrl();

  const handleTabClick = (tab: DashboardTab) => {
    if (onValueChange) {
      onValueChange(tab.value);
    }
    
    console.log(`Navigation to tab: ${tab.value}, path: ${tab.path}`);
    
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
          data-active={activeTab === tab.value ? "true" : "false"}
          onClick={() => handleTabClick(tab)}
        >
          {tab.icon}
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
