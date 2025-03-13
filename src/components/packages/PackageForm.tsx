
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
import { packFormSchema, PackFormValues } from "./PackageFormSchema";

interface PackageFormProps {
  editingPack: SeoPack | null;
  onSubmit: (data: PackFormValues) => void;
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
      // Convert array to string with line breaks when editing
      features: editingPack?.features ? editingPack.features.join("\n") : "",
      isActive: editingPack?.isActive !== undefined ? editingPack.isActive : true
    }
  });

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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    value={typeof field.value === 'string' ? field.value : Array.isArray(field.value) ? field.value.join('\n') : ''}
                    onChange={(e) => field.onChange(e.target.value)}
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
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
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
