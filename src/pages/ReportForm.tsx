
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addReport, updateReport, getReport } from "@/services/reportService";
import { getClients } from "@/services/clientService";
import { Client, ClientReport } from "@/types/client";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react";
import { DatePickerWithButton } from "@/components/ui/date-picker"

const ReportForm = () => {
  const { id, clientId: clientIdParam } = useParams<{ id?: string; clientId?: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [type, setType] = useState<"seo" | "performance" | "technical" | "social" | "local-seo">("seo");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [clientId, setClientId] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [report, setReport] = useState<ClientReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Handle date selection with proper typing
  const handleDateSelect = (selectedDate: Date | Date[] | undefined) => {
    if (selectedDate instanceof Date) {
      setDate(selectedDate);
    } else if (Array.isArray(selectedDate) && selectedDate.length > 0) {
      setDate(selectedDate[0]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Cargar el informe si estamos editando
        if (id) {
          const reportData = await getReport(id);
          if (reportData) {
            setReport(reportData);
            setTitle(reportData.title);
            setType(reportData.type as "seo" | "performance" | "technical" | "social" | "local-seo");
            setDate(new Date(reportData.date));
            setUrl(reportData.url || "");
            setNotes(reportData.notes || "");
            setClientId(reportData.clientId);
          } else {
            toast.error("No se encontró el informe");
            navigate("/reports");
            return;
          }
        }
        
        // Cargar clientes
        const clientsData = await getClients();
        setClients(clientsData);
        
        // Si estamos creando un nuevo informe y tenemos un cliente preseleccionado
        if (clientIdParam && !id) {
          setClientId(clientIdParam);
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
        toast.error("Error al cargar los datos");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [id, clientIdParam, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !type || !date || !clientId) {
      toast.error("Por favor, complete todos los campos.");
      return;
    }

    const reportData: Omit<ClientReport, "id"> = {
      clientId,
      title,
      date: date.toISOString(),
      type,
      url,
      notes,
      documentIds: [],
      shareToken: null,
      sharedAt: null,
      includeInProposal: false
    };

    try {
      setIsLoading(true);
      if (id) {
        // Actualizar informe existente
        if (report) {
          const updatedReport: ClientReport = { ...report, ...reportData };
          await updateReport(updatedReport);
          toast.success("Informe actualizado correctamente");
        }
      } else {
        // Crear nuevo informe
        await addReport(reportData);
        toast.success("Informe creado correctamente");
      }
      navigate(`/clients/${clientId}`);
    } catch (error) {
      console.error("Error al guardar el informe:", error);
      toast.error("Error al guardar el informe");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto">Cargando...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>{id ? "Editar Informe" : "Nuevo Informe"}</CardTitle>
          <CardDescription>
            Ingrese los detalles del informe.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="clientId">Cliente</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título del informe"
              />
            </div>
            <div>
              <Label htmlFor="type">Tipo</Label>
              <Select value={type} onValueChange={(value) => setType(value as "seo" | "performance" | "technical" | "social" | "local-seo")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seo">SEO</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="local-seo">Local SEO</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Fecha</Label>
              <DatePickerWithButton
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                initialFocus
              />
            </div>
            <div>
              <Label htmlFor="url">URL</Label>
              <Input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="URL del informe"
              />
            </div>
            <div>
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notas adicionales"
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportForm;
