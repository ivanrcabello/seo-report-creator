
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Client } from "@/types/client";
import { UseFormReturn } from "react-hook-form";

interface ClientSelectionProps {
  form: UseFormReturn<any>;
  isNewInvoice: boolean;
  isLoading: boolean;
  availableClients?: Client[];
  onClientChange: (clientId: string) => void;
}

export const ClientSelection = ({ 
  form, 
  isNewInvoice, 
  isLoading, 
  availableClients = [],
  onClientChange 
}: ClientSelectionProps) => {
  return (
    <FormField
      control={form.control}
      name="clientId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Cliente</FormLabel>
          <FormControl>
            <Select
              disabled={!isNewInvoice || isLoading}
              onValueChange={(value) => {
                field.onChange(value);
                onClientChange(value);
              }}
              value={field.value || ""}
              defaultValue={field.value || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar cliente" />
              </SelectTrigger>
              <SelectContent>
                {availableClients.length === 0 ? (
                  <SelectItem value="no-clients" disabled>
                    No hay clientes disponibles
                  </SelectItem>
                ) : (
                  availableClients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name} {client.company ? `(${client.company})` : ''}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
