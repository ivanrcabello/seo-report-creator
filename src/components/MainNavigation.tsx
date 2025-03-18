
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
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth";

const MainNavigation = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAdmin, userRole } = useAuth();

  // Determine if a path is active
  const isActivePath = (path: string) => {
    // Exact match
    if (location.pathname === path) return true;
    
    // Check if it's a tab in dashboard
    const tab = new URLSearchParams(location.search).get('tab');
    if (location.pathname === '/dashboard' && tab) {
      return path === `/${tab}`;
    }
    
    // Check if it's a sub-path
    return location.pathname.startsWith(path + '/');
  };

  // Common links for both admin and client
  const commonLinks = [
    { 
      href: "/dashboard", 
      label: "Dashboard", 
      icon: <Home className="h-5 w-5" />,
      active: isActivePath("/dashboard"),
      clientCanCreate: true
    },
    { 
      href: "/reports", 
      label: "Informes", 
      icon: <FileText className="h-5 w-5" />,
      active: isActivePath("/reports"),
      clientCanCreate: false
    },
    { 
      href: "/contracts", 
      label: "Contratos", 
      icon: <FileSignature className="h-5 w-5" />,
      active: isActivePath("/contracts"),
      clientCanCreate: false
    },
    { 
      href: "/proposals", 
      label: "Propuestas", 
      icon: <MailOpen className="h-5 w-5" />,
      active: isActivePath("/proposals"),
      clientCanCreate: false
    },
    { 
      href: "/invoices", 
      label: "Facturas", 
      icon: <FileSpreadsheet className="h-5 w-5" />,
      active: isActivePath("/invoices"),
      clientCanCreate: false
    },
    { 
      href: "/tickets", 
      label: "Tickets", 
      icon: <Ticket className="h-5 w-5" />,
      active: isActivePath("/tickets"),
      clientCanCreate: true
    },
    { 
      href: "/documents", 
      label: "Documentos", 
      icon: <FileText className="h-5 w-5" />,
      active: isActivePath("/documents"),
      clientCanCreate: false
    },
    { 
      href: "/settings", 
      label: "Configuración", 
      icon: <Settings className="h-5 w-5" />,
      active: isActivePath("/settings"),
      clientCanCreate: true
    },
  ];

  // Admin-only links
  const adminLinks = [
    { 
      href: "/clients", 
      label: "Clientes", 
      icon: <Users className="h-5 w-5" />,
      active: isActivePath("/clients"),
      clientCanCreate: false
    },
    { 
      href: "/packages", 
      label: "Paquetes", 
      icon: <Package className="h-5 w-5" />,
      active: isActivePath("/packages"),
      clientCanCreate: false
    },
  ];

  // Combine links based on role
  const links = isAdmin 
    ? [...commonLinks.slice(0, 1), ...adminLinks, ...commonLinks.slice(1)]
    : commonLinks;

  // For clients, make sure they can't access creation routes
  useEffect(() => {
    if (userRole === 'client') {
      const currentPath = location.pathname;
      // Check if client is trying to access a creation page
      const isCreationPath = currentPath.includes('/new') || currentPath.includes('/create') || currentPath.includes('/edit');
      
      if (isCreationPath) {
        // Find the base path
        const basePath = currentPath.split('/')[1];
        const linkInfo = links.find(link => link.href.includes(basePath));
        
        // If client can't create this resource, navigate away
        if (linkInfo && !linkInfo.clientCanCreate) {
          console.warn(`Client tried to access restricted creation path: ${currentPath}`);
          // The ProtectedRoute will handle redirect, this is just for logging
        }
      }
    }
  }, [location.pathname, userRole, links]);

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
              <Link 
                key={link.href} 
                to={link.href}
                aria-current={link.active ? "page" : undefined}
              >
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
        mobileMenuOpen ? "max-h-96" : "max-h-0"
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
