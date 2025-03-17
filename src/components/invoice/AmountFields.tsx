
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { InvoiceFormValues } from "@/types/invoiceTypes";

interface AmountFieldsProps {
  form: UseFormReturn<InvoiceFormValues>;
}

export const AmountFields = ({ form }: AmountFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="baseAmount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Importe Base (€)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                step="0.01"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="taxRate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de IVA (%)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                step="0.1"
                min="0"
                max="100"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
