
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { BarChart3, LogIn, UserPlus, ArrowRight, FileText, Users } from "lucide-react";

const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user && !isLoading) {
      navigate('/dashboard');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Cargando...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="h-8 w-8" />
                <h1 className="text-2xl font-bold">SEO Manager</h1>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
                Potencia tu estrategia SEO
              </h2>
              <p className="text-xl opacity-90 mb-8">
                Plataforma todo-en-uno para gestionar proyectos SEO, crear informes profesionales y hacer seguimiento de resultados.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-gray-100">
                  <Link to="/login">
                    <LogIn className="mr-2 h-5 w-5" />
                    Iniciar Sesión
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10 hover:text-white">
                  <Link to="/register">
                    <UserPlus className="mr-2 h-5 w-5" />
                    Registrarse
                  </Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 rounded-xl p-6 border border-white/20 backdrop-blur">
                <img 
                  src="/placeholder.svg" 
                  alt="SEO Dashboard" 
                  className="rounded-lg shadow-2xl" 
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Todo lo que necesitas para gestionar tu SEO</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Análisis SEO</h3>
                <p className="text-gray-600 mb-4">
                  Realiza auditorías completas, seguimiento de keywords y análisis de competencia.
                </p>
                <Button variant="link" className="px-0">
                  <span>Descubrir más</span>
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full bg-purple-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Informes Profesionales</h3>
                <p className="text-gray-600 mb-4">
                  Crea informes personalizados para tus clientes con datos relevantes y recomendaciones.
                </p>
                <Button variant="link" className="px-0">
                  <span>Descubrir más</span>
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full bg-green-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Gestión de Clientes</h3>
                <p className="text-gray-600 mb-4">
                  Administra tus clientes, propuestas, contratos y facturas desde un solo lugar.
                </p>
                <Button variant="link" className="px-0">
                  <span>Descubrir más</span>
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Empieza a optimizar hoy mismo</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Regístrate para acceder a todas las herramientas y funcionalidades que necesitas para mejorar tu estrategia SEO.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-gray-100">
              <Link to="/register">
                <UserPlus className="mr-2 h-5 w-5" />
                Crear Cuenta Gratis
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10 hover:text-white">
              <Link to="/login">
                Ya tengo una cuenta
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-8">
            <BarChart3 className="h-8 w-8 mr-2" />
            <h2 className="text-2xl font-bold">SEO Manager</h2>
          </div>
          <div className="text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} SEO Manager. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
