
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface DateFieldsProps {
  form: UseFormReturn<any>;
}

export const DateFields = ({ form }: DateFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="issueDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fecha de Emisión</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="dueDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fecha de Vencimiento</FormLabel>
            <FormControl>
              <Input 
                type="date" 
                {...field} 
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
