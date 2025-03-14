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
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker"

const ReportForm = () => {
  const { id, clientId: clientIdParam } = useParams<{ id?: string; clientId?: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [clientId, setClientId] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [report, setReport] = useState<ClientReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
            setType(reportData.type);
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
              <Input
                type="text"
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="Tipo de informe"
              />
            </div>
            <div>
              <Label>Fecha</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <DatePicker
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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
