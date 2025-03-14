
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface NotesFieldProps {
  form: UseFormReturn<any>;
}

export const NotesField = ({ form }: NotesFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Notas</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Notas o comentarios adicionales para la factura"
              {...field}
              value={field.value || ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
