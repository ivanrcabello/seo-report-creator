
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Settings, 
  Building,
  FileText,
  Key
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export function SettingsNavigation() {
  const location = useLocation();
  
  const settingsLinks = [
    {
      href: "/settings",
      label: "Empresa",
      icon: <Building className="h-5 w-5 mr-2" />,
      active: location.pathname === "/settings"
    },
    {
      href: "/settings/templates",
      label: "Plantillas",
      icon: <FileText className="h-5 w-5 mr-2" />,
      active: location.pathname === "/settings/templates"
    },
    {
      href: "/settings/api",
      label: "API Keys",
      icon: <Key className="h-5 w-5 mr-2" />,
      active: location.pathname === "/settings/api"
    }
  ];

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Settings className="mr-2 h-6 w-6" />
        Configuración
      </h1>
      
      <NavigationMenu className="max-w-none w-full justify-start">
        <NavigationMenuList className="space-x-2">
          {settingsLinks.map((link) => (
            <NavigationMenuItem key={link.href}>
              <Link to={link.href}>
                <Button
                  variant={link.active ? "default" : "outline"}
                  className="gap-2"
                >
                  {link.icon}
                  {link.label}
                </Button>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
