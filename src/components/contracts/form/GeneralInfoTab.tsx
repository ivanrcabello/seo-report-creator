
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
  const handleClientChange = async (selectedClientId: string) => {
    if (selectedClientId) {
      try {
        const clientData = await getClient(selectedClientId);
        
        if (clientData) {
          form.setValue("clientInfo.name", clientData.name);
          form.setValue("clientInfo.company", clientData.company || "");
        }
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    }
  };

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
              disabled={!!clientId}
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
              <DatePicker
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
              <DatePicker
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
