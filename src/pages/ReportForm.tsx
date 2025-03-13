import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  ArrowLeft, 
  Save,
  FileCheck, 
  Building
} from "lucide-react";
import { Link } from "react-router-dom";
import { getClient, getClients, addReport, updateReport, getReport } from "@/services/clientService";
import { ClientReport } from "@/types/client";

const formSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres"),
  type: z.enum(["seo", "performance", "technical", "social", "local-seo"]),
  date: z.string(),
  url: z.string().url("Por favor, introduce una URL válida").optional().or(z.literal("")),
  notes: z.string().optional(),
  clientId: z.string().min(1, "Debes seleccionar un cliente"),
});

type FormValues = z.infer<typeof formSchema>;

const ReportForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const searchParams = new URLSearchParams(location.search);
  const clientIdParam = searchParams.get('clientId');
  
  const [clients, setClients] = useState(getClients());
  const [report, setReport] = useState<ClientReport | null>(null);
  const [isLoading, setIsLoading] = useState(id ? true : false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "seo",
      date: new Date().toISOString().slice(0, 10),
      url: "",
      notes: "",
      clientId: clientIdParam || "",
    },
  });

  useEffect(() => {
    if (id) {
      const existingReport = getReport(id);
      if (existingReport) {
        setReport(existingReport);
        form.reset({
          title: existingReport.title,
          type: existingReport.type,
          date: new Date(existingReport.date).toISOString().slice(0, 10),
          url: existingReport.url || "",
          notes: existingReport.notes || "",
          clientId: existingReport.clientId,
        });
      }
      setIsLoading(false);
    }
  }, [id, form]);

  const onSubmit = (values: FormValues) => {
    try {
      if (id && report) {
        const updatedReport = updateReport({
          ...report,
          title: values.title,
          type: values.type,
          date: values.date,
          url: values.url || undefined,
          notes: values.notes || undefined,
        });
        
        toast({
          title: "Informe actualizado",
          description: `El informe "${values.title}" ha sido actualizado.`,
        });
        
        navigate(`/reports/${updatedReport.id}`);
      } else {
        const newReport = addReport({
          title: values.title,
          type: values.type,
          date: values.date,
          clientId: values.clientId,
          url: values.url || undefined,
          notes: values.notes || undefined,
        });
        
        toast({
          title: "Informe creado",
          description: `El informe "${values.title}" ha sido creado.`,
        });
        
        navigate(`/reports/${newReport.id}`);
      }
    } catch (error) {
      console.error("Error al guardar el informe:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar el informe. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="container mx-auto py-8">Cargando...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Link to={id ? `/reports/${id}` : "/reports"} className="mr-4">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">
          {id ? "Editar" : "Nuevo"} Informe
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-blue-600" />
            {id ? "Actualizar información del informe" : "Crear nuevo informe"}
          </CardTitle>
          <CardDescription>
            Completa el formulario para {id ? "actualizar los datos del" : "crear un nuevo"} informe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título del Informe*</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Auditoría SEO Mensual" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!id && (
                  <FormField
                    control={form.control}
                    name="clientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cliente*</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar cliente" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {clients.map((client) => (
                              <SelectItem key={client.id} value={client.id}>
                                {client.name} {client.company ? `(${client.company})` : ''}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Informe*</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="seo">SEO</SelectItem>
                          <SelectItem value="performance">Rendimiento</SelectItem>
                          <SelectItem value="technical">Técnico</SelectItem>
                          <SelectItem value="social">Social</SelectItem>
                          <SelectItem value="local-seo">SEO Local</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha*</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem className="col-span-1 md:col-span-2">
                      <FormLabel>URL Analizada</FormLabel>
                      <FormControl>
                        <Input placeholder="https://www.ejemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="col-span-1 md:col-span-2">
                      <FormLabel>Notas</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Notas adicionales sobre el informe"
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="gap-2">
                  <Save className="h-4 w-4" />
                  {id ? "Actualizar" : "Guardar"} Informe
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportForm;
