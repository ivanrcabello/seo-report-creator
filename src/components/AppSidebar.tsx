
import { useLocation, Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { 
  Home, 
  Users, 
  FileText, 
  Package, 
  MailOpen,
  BarChart,
  FileSpreadsheet,
  Settings
} from "lucide-react";

export function AppSidebar() {
  const location = useLocation();
  
  const links = [
    { 
      href: "/", 
      label: "Inicio", 
      icon: <Home className="h-5 w-5" />,
      active: location.pathname === "/"
    },
    { 
      href: "/clients", 
      label: "Clientes", 
      icon: <Users className="h-5 w-5" />,
      active: location.pathname.startsWith("/clients")
    },
    { 
      href: "/reports", 
      label: "Informes", 
      icon: <FileText className="h-5 w-5" />,
      active: location.pathname.startsWith("/reports") || location.pathname === "/report"
    },
    { 
      href: "/packages", 
      label: "Paquetes", 
      icon: <Package className="h-5 w-5" />,
      active: location.pathname.startsWith("/packages")
    },
    { 
      href: "/proposals", 
      label: "Propuestas", 
      icon: <MailOpen className="h-5 w-5" />,
      active: location.pathname.startsWith("/proposals")
    },
    { 
      href: "/invoices", 
      label: "Facturas", 
      icon: <FileSpreadsheet className="h-5 w-5" />,
      active: location.pathname.startsWith("/invoices")
    },
    { 
      href: "/settings", 
      label: "Configuración", 
      icon: <Settings className="h-5 w-5" />,
      active: location.pathname.startsWith("/settings")
    },
  ];

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-3">
          <BarChart className="h-6 w-6 text-purple-600" />
          <span className="text-xl font-bold">SEO Manager</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild tooltip={item.label} isActive={item.active}>
                    <Link to={item.href}>
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <div className="p-4 text-xs text-center text-gray-500">
          SEO Manager v1.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
