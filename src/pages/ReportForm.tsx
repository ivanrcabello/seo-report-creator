
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Calendar, FileText, Globe, Pencil } from "lucide-react";
import { 
  getClients, 
  getClient,
  getReport,
  addReport,
  updateReport
} from "@/services/clientService";
import { Client, ClientReport } from "@/types/client";

const ReportForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [report, setReport] = useState<ClientReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get clientId from URL query params if it exists (for new reports)
  const queryParams = new URLSearchParams(location.search);
  const clientIdFromQuery = queryParams.get('clientId');

  const form = useForm({
    defaultValues: {
      clientId: clientIdFromQuery || "",
      title: "",
      type: "seo" as const,
      url: "",
      notes: "",
    }
  });

  useEffect(() => {
    const allClients = getClients();
    setClients(allClients);

    if (id && id !== 'new') {
      const foundReport = getReport(id);
      if (foundReport) {
        setReport(foundReport);
        form.reset({
          clientId: foundReport.clientId,
          title: foundReport.title,
          type: foundReport.type,
          url: foundReport.url || "",
          notes: foundReport.notes || "",
        });
      }
    } else if (clientIdFromQuery) {
      // If creating a new report with a pre-selected client
      form.setValue("clientId", clientIdFromQuery);
    }
    
    setIsLoading(false);
  }, [id, clientIdFromQuery, form]);

  const handleSubmit = (data: any) => {
    try {
      if (id && id !== 'new') {
        // Update existing report
        if (report) {
          const updatedReport = updateReport({
            ...report,
            ...data,
            date: new Date().toISOString(), // Update the date to now
          });
          toast({
            title: "Informe actualizado",
            description: `El informe ${updatedReport.title} ha sido actualizado.`,
          });
          navigate(`/reports/${updatedReport.id}`);
        }
      } else {
        // Create new report
        const newReport = addReport({
          clientId: data.clientId,
          title: data.title,
          type: data.type,
          date: new Date().toISOString(),
          url: data.url,
          notes: data.notes,
        });
        toast({
          title: "Informe creado",
          description: `El informe ${newReport.title} ha sido creado.`,
        });
        navigate(`/reports/${newReport.id}`);
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar el informe. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Cliente';
  };

  if (isLoading) {
    return <div className="container mx-auto py-8">Cargando...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 mr-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">
          {report ? `Editar Informe` : 'Nuevo Informe'}
        </h1>
      </div>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            {report ? `Editar Informe: ${report.title}` : 'Crear Nuevo Informe'}
          </CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="clientId"
                rules={{ required: "Debes seleccionar un cliente" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select 
                      disabled={!!clientIdFromQuery}
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                rules={{ required: "El título es obligatorio" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <Pencil className="h-4 w-4 text-blue-600" />
                      Título del Informe
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Título descriptivo del informe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                rules={{ required: "El tipo es obligatorio" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Informe</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="seo">SEO</SelectItem>
                        <SelectItem value="performance">Rendimiento</SelectItem>
                        <SelectItem value="technical">Técnico</SelectItem>
                        <SelectItem value="social">Social</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Categoría principal del informe
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <Globe className="h-4 w-4 text-blue-600" />
                      URL Analizada
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://ejemplo.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      URL del sitio web o página analizada (opcional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Notas adicionales sobre el informe..." 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancelar
              </Button>
              <Button type="submit">
                {report ? "Guardar Cambios" : "Crear Informe"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default ReportForm;
