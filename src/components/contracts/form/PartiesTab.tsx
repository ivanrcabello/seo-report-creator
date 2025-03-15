
import { UseFormReturn } from "react-hook-form";
import { ContractFormValues } from "../ContractFormSchema";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PartiesTabProps {
  form: UseFormReturn<ContractFormValues>;
}

export const PartiesTab = ({ form }: PartiesTabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Información del Cliente</h3>
        
        <FormField
          control={form.control}
          name="clientInfo.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre / Razón Social</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="clientInfo.company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Empresa (opcional)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="clientInfo.taxId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CIF/NIF (opcional)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="clientInfo.address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección (opcional)</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Información del Profesional</h3>
        
        <FormField
          control={form.control}
          name="professionalInfo.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre / Razón Social</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="professionalInfo.company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Empresa</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="professionalInfo.taxId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CIF/NIF</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="professionalInfo.address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
