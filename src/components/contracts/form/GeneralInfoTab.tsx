
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { ContractFormValues } from "../ContractFormSchema";
import { Client } from "@/types/client";
import { getClient } from "@/services/clientService";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";

interface GeneralInfoTabProps {
  form: UseFormReturn<ContractFormValues>;
  clients: Client[];
  clientId?: string; // Optional client ID from URL params
}

export const GeneralInfoTab = ({ form, clients, clientId }: GeneralInfoTabProps) => {
  console.log("GeneralInfoTab - clientId:", clientId);
  
  const handleClientChange = async (selectedClientId: string) => {
    if (selectedClientId) {
      try {
        console.log("Client selected, fetching data for:", selectedClientId);
        const clientData = await getClient(selectedClientId);
        
        if (clientData) {
          console.log("Setting client info:", clientData.name);
          form.setValue("clientInfo.name", clientData.name);
          form.setValue("clientInfo.company", clientData.company || "");
          // Update contract title with client name for better identification
          form.setValue("title", `Contrato de Servicios SEO - ${clientData.name}`);
        }
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    }
  };

  // Pre-fill client dropdown when clientId is provided
  useEffect(() => {
    if (clientId && form.getValues("clientId") !== clientId) {
      console.log("Setting form clientId value from props:", clientId);
      form.setValue("clientId", clientId);
    }
  }, [clientId, form]);

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Título del Contrato</FormLabel>
            <FormControl>
              <Input placeholder="Contrato de Servicios SEO" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="clientId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cliente</FormLabel>
            <Select
              disabled={!!clientId} // Disable if clientId is provided from props
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                handleClientChange(value);
              }}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un cliente" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name} {client.company ? `(${client.company})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Fecha de Inicio</FormLabel>
              <DatePickerWithButton
                selected={field.value}
                onSelect={field.onChange}
                mode="single"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Fecha de Finalización (opcional)</FormLabel>
              <DatePickerWithButton
                selected={field.value}
                onSelect={field.onChange}
                mode="single"
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="phase1Fee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Importe Primera Fase (€)</FormLabel>
              <FormControl>
                <Input type="number" {...field} min="0" step="0.01" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="monthlyFee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cuota Mensual (€)</FormLabel>
              <FormControl>
                <Input type="number" {...field} min="0" step="0.01" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <Select 
                value={field.value} 
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el estado" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="draft">Borrador</SelectItem>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="completed">Completado</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

// Add the DatePickerWithButton component to improve the UX as shown in the reference image
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function DatePickerWithButton({
  className,
  mode = "single",
  selected,
  onSelect,
  initialFocus = false,
}: {
  className?: string;
  mode?: "single" | "range" | "multiple";
  selected?: Date | Date[] | { from: Date; to: Date };
  onSelect?: (date: Date | Date[] | { from: Date; to: Date }) => void;
  initialFocus?: boolean;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !selected && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected && mode === "single"
            ? format(selected as Date, "d MMMM yyyy")
            : <span>Selecciona una fecha</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected as Date}
          onSelect={onSelect as (date: Date) => void}
          initialFocus={initialFocus}
          className="pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
}
