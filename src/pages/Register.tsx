
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { BarChart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const { signUp, signInWithGoogle, isLoading } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string>("");
  const [resendLoading, setResendLoading] = useState(false);
  const location = useLocation();

  const form = useForm<RegisterFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Check for error parameters in URL
  useEffect(() => {
    // Parse error from URL hash if present
    const hashParams = new URLSearchParams(location.hash.substring(1));
    const error = hashParams.get("error");
    const errorDescription = hashParams.get("error_description");
    
    if (error === "access_denied" && errorDescription?.includes("Email link is invalid or has expired")) {
      setAuthError("El enlace de verificación de correo electrónico ha expirado o es inválido. Por favor, solicita un nuevo correo de verificación.");
    }
  }, [location]);

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      if (data.password !== data.confirmPassword) {
        setAuthError("Las contraseñas no coinciden");
        return;
      }

      setAuthError(null);
      setRegisteredEmail(data.email);
      await signUp(data.email, data.password, data.name);
      setSuccess(true);
      form.reset();
    } catch (error: any) {
      if (error.message) {
        setAuthError(error.message);
      } else {
        setAuthError("Error al registrarse. Por favor, intenta de nuevo.");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    await signInWithGoogle();
  };

  const handleResendVerification = async () => {
    try {
      setResendLoading(true);
      
      if (!registeredEmail) {
        setAuthError("No hay dirección de correo electrónico para reenviar la verificación.");
        return;
      }
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: registeredEmail,
      });
      
      if (error) {
        console.error("Error resending verification email:", error);
        throw error;
      }
      
      toast.success("Se ha enviado un nuevo correo de verificación. Por favor, revisa tu bandeja de entrada.");
    } catch (error: any) {
      console.error("Resend verification exception:", error);
      setAuthError(error.message || "Error al enviar el correo de verificación. Por favor, intenta de nuevo.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <BarChart className="h-12 w-12 text-blue-600" />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Crear cuenta</CardTitle>
            <CardDescription>
              Regístrate para acceder a la plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="py-4 text-center space-y-4">
                <Alert className="mb-4 bg-green-50 border-green-200">
                  <AlertTitle>¡Registro exitoso!</AlertTitle>
                  <AlertDescription>
                    Por favor verifica tu correo electrónico para activar tu cuenta. Si no lo recibes, puedes solicitar un nuevo correo de verificación.
                  </AlertDescription>
                </Alert>
                <Button 
                  variant="outline" 
                  onClick={handleResendVerification}
                  disabled={resendLoading}
                  className="mb-4"
                >
                  {resendLoading ? "Enviando..." : "Reenviar correo de verificación"}
                </Button>
                <Link to="/login">
                  <Button>Ir a Iniciar Sesión</Button>
                </Link>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {authError && authError.includes("expirado") && (
                    <Alert className="mb-4 bg-amber-50 border-amber-200">
                      <AlertTitle>Enlace expirado</AlertTitle>
                      <AlertDescription className="space-y-4">
                        <p>{authError}</p>
                        <Link to="/login">
                          <Button variant="outline" size="sm">
                            Ir a Iniciar Sesión
                          </Button>
                        </Link>
                      </AlertDescription>
                    </Alert>
                  )}

                  <FormField
                    control={form.control}
                    name="name"
                    rules={{
                      required: "El nombre es obligatorio",
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Tu nombre" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    rules={{
                      required: "El email es obligatorio",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Email inválido",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="correo@ejemplo.com" 
                            {...field} 
                            onChange={(e) => {
                              field.onChange(e);
                              setRegisteredEmail(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    rules={{
                      required: "La contraseña es obligatoria",
                      minLength: {
                        value: 6,
                        message: "La contraseña debe tener al menos 6 caracteres",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    rules={{
                      required: "Confirma tu contraseña",
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar contraseña</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {authError && !authError.includes("expirado") && (
                    <div className="text-sm text-red-500 px-1">{authError}</div>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Cargando..." : "Registrarse"}
                  </Button>
                  
                  <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">o continuar con</span>
                    </div>
                  </div>

                  <Button 
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 24 24" width="24" height="24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continuar con Google
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center">
              ¿Ya tienes una cuenta?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Iniciar sesión
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
