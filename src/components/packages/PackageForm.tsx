
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SeoPack } from "@/types/client";
import { 
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { packFormSchema, PackFormValues, transformFormData } from "./PackageFormSchema";
import { Checkbox } from "@/components/ui/checkbox";

interface PackageFormProps {
  editingPack: SeoPack | null;
  onSubmit: (data: SeoPack) => void;
  onCancel: () => void;
}

export const PackageForm = ({ editingPack, onSubmit, onCancel }: PackageFormProps) => {
  // Initialize form with default values or editing values
  const form = useForm<PackFormValues>({
    resolver: zodResolver(packFormSchema),
    defaultValues: {
      name: editingPack?.name || "",
      description: editingPack?.description || "",
      price: editingPack?.price || 0,
      // Convert features array to string for the form
      features: editingPack?.features ? editingPack.features.join("\n") : "",
      isActive: editingPack?.isActive !== undefined ? editingPack.isActive : true
    }
  });

  const handleFormSubmit = (values: PackFormValues) => {
    // Transform form values and prepare data for submission
    const transformedData = transformFormData(values);
    
    // Prepare the data to match SeoPack type
    const packData: Partial<SeoPack> = {
      name: transformedData.name,
      description: transformedData.description,
      price: transformedData.price,
      features: transformedData.features,
      isActive: transformedData.isActive
    };
    
    // Add id if editing
    if (editingPack?.id) {
      packData.id = editingPack.id;
    }
    
    // Submit the transformed data
    onSubmit(packData as SeoPack);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {editingPack ? "Editar Paquete" : "Crear Nuevo Paquete"}
        </DialogTitle>
        <DialogDescription>
          Completa los campos para {editingPack ? "actualizar el" : "crear un nuevo"} paquete de SEO.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Paquete</FormLabel>
                <FormControl>
                  <Input placeholder="ej. SEO Premium" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea placeholder="Descripción breve del paquete..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio (€, IVA incluido)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" {...field} />
                </FormControl>
                <FormDescription>
                  Introduce el precio en euros con IVA incluido
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="features"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Características</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Escribe cada característica en una línea separada..." 
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Escribe cada característica en una línea separada
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox 
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Paquete activo
                  </FormLabel>
                  <FormDescription>
                    Desactiva esta opción para ocultar el paquete sin eliminarlo
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {editingPack ? "Actualizar" : "Crear"} Paquete
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};
