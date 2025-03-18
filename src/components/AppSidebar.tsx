
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
  Settings,
  FileSignature,
  LogOut,
  Ticket
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import logger from "@/services/advancedLogService";

// Logger para AppSidebar
const sidebarLogger = logger.getLogger('AppSidebar');

export function AppSidebar() {
  const location = useLocation();
  const { signOut, userRole, user } = useAuth();
  
  const adminLinks = [
    { 
      href: "/dashboard", 
      label: "Dashboard", 
      icon: <Home className="h-5 w-5" />,
      active: location.pathname === "/dashboard"
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
      href: "/contracts", 
      label: "Contratos", 
      icon: <FileSignature className="h-5 w-5" />,
      active: location.pathname.startsWith("/contracts")
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
    { 
      href: "/tickets", 
      label: "Tickets", 
      icon: <Ticket className="h-5 w-5" />,
      active: location.pathname.startsWith("/tickets")
    },
  ];
  
  const clientLinks = [
    { 
      href: "/dashboard", 
      label: "Dashboard", 
      icon: <Home className="h-5 w-5" />,
      active: location.pathname === "/dashboard"
    },
    { 
      href: "/tickets", 
      label: "Tickets", 
      icon: <Ticket className="h-5 w-5" />,
      active: location.pathname.startsWith("/tickets")
    }
  ];

  const links = userRole === "admin" ? adminLinks : clientLinks;

  // Log de navegación de la barra lateral
  useEffect(() => {
    sidebarLogger.debug("Navegación de sidebar", { 
      pathname: location.pathname,
      userRole,
      availableRoutes: links.map(link => link.href).join(', ')
    });
  }, [location.pathname, userRole, links]);

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
        
        {user && (
          <SidebarGroup>
            <SidebarGroupLabel>Usuario</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="px-3 py-2">
                <div className="text-sm font-medium">{user.email}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Rol: {userRole === "admin" ? "Administrador" : "Cliente"}
                </div>
              </div>
              <div className="px-3 pt-2">
                <Button variant="outline" size="sm" className="w-full" onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter className="border-t">
        <div className="p-4 text-xs text-center text-gray-500">
          SEO Manager v1.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
