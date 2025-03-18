
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Users, 
  FileText, 
  BarChart,
  Menu,
  X,
  Package,
  MailOpen,
  FileSpreadsheet,
  Settings,
  Ticket,
  FileSignature
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth";

const MainNavigation = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAdmin } = useAuth();

  // Common links for both admin and client
  const commonLinks = [
    { 
      href: "/dashboard", 
      label: "Dashboard", 
      icon: <Home className="h-5 w-5" />,
      active: location.pathname === "/dashboard"
    },
    { 
      href: "/reports", 
      label: "Informes", 
      icon: <FileText className="h-5 w-5" />,
      active: location.pathname.startsWith("/reports")
    },
    { 
      href: "/contracts", 
      label: "Contratos", 
      icon: <FileSignature className="h-5 w-5" />,
      active: location.pathname.startsWith("/contracts")
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
      href: "/tickets", 
      label: "Tickets", 
      icon: <Ticket className="h-5 w-5" />,
      active: location.pathname.startsWith("/tickets")
    },
    { 
      href: "/settings", 
      label: "Configuración", 
      icon: <Settings className="h-5 w-5" />,
      active: location.pathname.startsWith("/settings")
    },
  ];

  // Admin-only links
  const adminLinks = [
    { 
      href: "/clients", 
      label: "Clientes", 
      icon: <Users className="h-5 w-5" />,
      active: location.pathname.startsWith("/clients")
    },
    { 
      href: "/packages", 
      label: "Paquetes", 
      icon: <Package className="h-5 w-5" />,
      active: location.pathname.startsWith("/packages")
    },
  ];

  // Combine links based on role
  const links = isAdmin 
    ? [...commonLinks.slice(0, 1), ...adminLinks, ...commonLinks.slice(1)]
    : commonLinks;

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="flex items-center gap-2">
              <BarChart className="h-6 w-6 text-purple-600" />
              <span className="text-xl font-bold">SEO Manager</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {links.map((link) => (
              <Link key={link.href} to={link.href}>
                <Button 
                  variant={link.active ? "default" : "ghost"}
                  className="gap-2"
                >
                  {link.icon}
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>
          
          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className={cn(
        "md:hidden border-t overflow-hidden transition-all duration-300 ease-in-out",
        mobileMenuOpen ? "max-h-80" : "max-h-0"
      )}>
        <nav className="flex flex-col py-2 px-4 space-y-1">
          {links.map((link) => (
            <Link 
              key={link.href} 
              to={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md",
                link.active 
                  ? "bg-purple-100 text-purple-700" 
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default MainNavigation;
