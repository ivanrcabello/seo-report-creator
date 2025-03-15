
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface InvoiceNumberFieldProps {
  form: UseFormReturn<any>;
  isNewInvoice: boolean;
  invoiceNumber?: string;
}

export const InvoiceNumberField = ({ form, isNewInvoice, invoiceNumber }: InvoiceNumberFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="invoiceNumber"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Número de Factura</FormLabel>
          <FormControl>
            <Input 
              {...field} 
              placeholder={isNewInvoice ? "Se generará automáticamente" : ""}
              disabled={isNewInvoice}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
