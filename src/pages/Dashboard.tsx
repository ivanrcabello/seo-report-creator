
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import { ClientDashboard } from "@/components/dashboard/ClientDashboard";
import { Suspense, lazy } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, MessageSquare, Settings, BarChart2 } from "lucide-react";
import { Link } from "react-router-dom";

// Use lazy loading for the TicketsTab to improve performance
const TicketsTab = lazy(() => import("@/components/dashboard/tabs/TicketsTab"));

export interface DashboardProps {
  activeTab?: string;
  isNew?: boolean;
  newContract?: boolean;
  newProposal?: boolean;
}

export default function Dashboard({ activeTab, isNew, newContract, newProposal }: DashboardProps) {
  const { isAdmin, userRole, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  console.log("Dashboard - Is admin:", isAdmin, "Active tab:", activeTab, "UserRole:", userRole, "User ID:", user?.id);
  console.log("Dashboard props:", { isNew, newContract, newProposal });
  
  // Parse the tab from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get("tab");
  
  // Use tab from URL or passed prop
  const currentTab = tabFromUrl || activeTab;
  
  // Simulate loading for better UX
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  
  // Enforce permissions for specific tabs
  useEffect(() => {
    // If no user or role, redirect to login
    if (!user || !userRole) {
      navigate("/login");
      return;
    }

    if (userRole === "client") {
      // Clients can't access admin-only tabs
      const adminOnlyTabs = ["clients", "packages"];
      if (adminOnlyTabs.includes(tabFromUrl || '')) {
        toast.error("No tienes permiso para acceder a esta sección");
        navigate("/dashboard");
      }
      
      // Check if we're trying to access creation paths
      const creationPaths = [
        "/invoices/new",
        "/contracts/new",
        "/proposals/new",
        "/reports/new"
      ];
      
      if (creationPaths.some(path => location.pathname === path)) {
        toast.error("No tienes permiso para crear este recurso");
        navigate("/dashboard");
      }
    }
  }, [tabFromUrl, userRole, navigate, user, location.pathname]);

  // If activeTab is "tickets", render the TicketsTab component directly
  if (currentTab === "tickets") {
    return (
      <div className="container mx-auto py-6">
        <Suspense fallback={<div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
          <span>Cargando tickets...</span>
        </div>}>
          <TicketsTab />
        </Suspense>
      </div>
    );
  }

  // If there's a specific tab to render, use the respective dashboards
  if (activeTab || tabFromUrl) {
    return (
      <div className="container mx-auto py-6">
        <Suspense fallback={<div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
          <span>Cargando dashboard...</span>
        </div>}>
          {isAdmin ? 
            <AdminDashboard 
              activeTab={currentTab} 
              newContract={newContract} 
              newProposal={newProposal} 
              isNew={isNew}
            /> : 
            <ClientDashboard activeTab={currentTab} />
          }
        </Suspense>
      </div>
    );
  }

  // If no specific tab is requested, show the main dashboard with quick access cards
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Panel de Control</h1>
      
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="h-12 w-12 animate-spin text-primary mr-3" />
          <span className="text-xl">Cargando datos...</span>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link to="/invoices" className="block">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  Facturas
                </CardTitle>
                <CardDescription>Gestión de facturas y cobros</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm">Ver Facturas</Button>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/contracts" className="block">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-500" />
                  Contratos
                </CardTitle>
                <CardDescription>Administración de contratos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm">Ver Contratos</Button>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/proposals" className="block">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-amber-500" />
                  Propuestas
                </CardTitle>
                <CardDescription>Propuestas comerciales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm">Ver Propuestas</Button>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/reports" className="block">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-purple-500" />
                  Informes
                </CardTitle>
                <CardDescription>Análisis y reportes SEO</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm">Ver Informes</Button>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/tickets" className="block">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-red-500" />
                  Soporte
                </CardTitle>
                <CardDescription>Tickets y asistencia</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm">Ver Tickets</Button>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/settings" className="block">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-500" />
                  Ajustes
                </CardTitle>
                <CardDescription>Configuración de la cuenta</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm">Ver Ajustes</Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      )}
    </div>
  );
}
