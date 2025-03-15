
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
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

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const { signUp, isLoading } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<RegisterFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      if (data.password !== data.confirmPassword) {
        setAuthError("Las contraseñas no coinciden");
        return;
      }

      setAuthError(null);
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
              <div className="py-4 text-center">
                <div className="text-green-500 mb-4">
                  ¡Registro exitoso! Por favor verifica tu correo electrónico para activar tu cuenta.
                </div>
                <Link to="/login">
                  <Button>Ir a Iniciar Sesión</Button>
                </Link>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                          <Input placeholder="correo@ejemplo.com" {...field} />
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

                  {authError && (
                    <div className="text-sm text-red-500 px-1">{authError}</div>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Cargando..." : "Registrarse"}
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
