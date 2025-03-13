
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SeoPack } from "@/types/client";
import { getAllSeoPacks, addSeoPack, updateSeoPack, deleteSeoPack } from "@/services/packService";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Edit, 
  Trash, 
  Package, 
  PlusCircle,
  CheckCircle,
  Euro
} from "lucide-react";
import { toast } from "sonner";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Schema de validación para el formulario de paquete
const packFormSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  price: z.coerce.number().positive("El precio debe ser positivo"),
  features: z.string().transform(val => val.split("\n").map(item => item.trim()).filter(Boolean)),
  isActive: z.boolean().default(true)
});

type PackFormValues = z.infer<typeof packFormSchema>;

const Packages = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingPack, setEditingPack] = useState<SeoPack | null>(null);
  const queryClient = useQueryClient();

  // Obtener todos los paquetes
  const { data: packages = [], isLoading } = useQuery({
    queryKey: ["packages"],
    queryFn: getAllSeoPacks
  });

  // Formulario para crear/editar paquetes
  const form = useForm<PackFormValues>({
    resolver: zodResolver(packFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      features: "", // This is a string that will be transformed into an array
      isActive: true
    }
  });

  // Mutación para agregar un paquete
  const addPackMutation = useMutation({
    mutationFn: addSeoPack,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      toast.success("Paquete creado correctamente");
      setIsOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast.error("Error al crear el paquete");
      console.error(error);
    }
  });

  // Mutación para actualizar un paquete
  const updatePackMutation = useMutation({
    mutationFn: updateSeoPack,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      toast.success("Paquete actualizado correctamente");
      setIsOpen(false);
      setEditingPack(null);
      form.reset();
    },
    onError: (error) => {
      toast.error("Error al actualizar el paquete");
      console.error(error);
    }
  });

  // Mutación para eliminar un paquete
  const deletePackMutation = useMutation({
    mutationFn: deleteSeoPack,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      toast.success("Paquete eliminado correctamente");
    },
    onError: (error) => {
      toast.error("Error al eliminar el paquete");
      console.error(error);
    }
  });

  // Función para manejar el envío del formulario
  const onSubmit = (data: PackFormValues) => {
    if (editingPack) {
      updatePackMutation.mutate({
        ...editingPack,
        name: data.name,
        description: data.description,
        price: data.price,
        features: Array.isArray(data.features) ? data.features : data.features.split("\n").map(item => item.trim()).filter(Boolean),
        isActive: data.isActive
      });
    } else {
      addPackMutation.mutate({
        name: data.name,
        description: data.description,
        price: data.price,
        features: Array.isArray(data.features) ? data.features : data.features.split("\n").map(item => item.trim()).filter(Boolean),
        isActive: data.isActive
      });
    }
  };

  // Función para abrir el formulario para editar
  const handleEdit = (pack: SeoPack) => {
    setEditingPack(pack);
    form.reset({
      name: pack.name,
      description: pack.description,
      price: pack.price,
      features: pack.features.join("\n"), // Convert array to string with line breaks
      isActive: pack.isActive
    });
    setIsOpen(true);
  };

  // Función para abrir el formulario para crear
  const handleCreate = () => {
    setEditingPack(null);
    form.reset({
      name: "",
      description: "",
      price: 0,
      features: "", // Empty string for features
      isActive: true
    });
    setIsOpen(true);
  };

  // Función para eliminar un paquete
  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este paquete?")) {
      deletePackMutation.mutate(id);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Package className="h-8 w-8 text-purple-600" />
          Paquetes de SEO
        </h1>
        <Button onClick={handleCreate} className="gap-1">
          <Plus className="h-4 w-4" />
          Crear Paquete
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="bg-gray-100 h-48"></CardHeader>
              <CardContent className="py-4">
                <div className="h-6 bg-gray-100 rounded mb-2"></div>
                <div className="h-4 bg-gray-100 rounded mb-2"></div>
                <div className="h-4 bg-gray-100 rounded mb-2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : packages.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-gray-500 mb-4">No hay paquetes disponibles</p>
            <Button onClick={handleCreate} variant="outline" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              Crear Primer Paquete
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pack) => (
            <Card key={pack.id} className={`border-2 ${!pack.isActive ? 'opacity-70 border-gray-200' : 'border-purple-200'}`}>
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-bold">{pack.name}</CardTitle>
                  {!pack.isActive && (
                    <Badge variant="outline" className="bg-gray-100 text-gray-600">Inactivo</Badge>
                  )}
                </div>
                <CardDescription className="text-base">{pack.description}</CardDescription>
                <div className="mt-2 text-2xl font-bold text-purple-700 flex items-center">
                  <Euro className="h-5 w-5 mr-1" />
                  {pack.price.toFixed(2)}
                  <span className="text-sm font-normal text-gray-500 ml-1">(IVA incluido)</span>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <h4 className="font-semibold mb-2">Características:</h4>
                <ul className="space-y-2">
                  {pack.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleEdit(pack)}
                  className="gap-1"
                >
                  <Edit className="h-4 w-4" />
                  Editar
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleDelete(pack.id)}
                  className="gap-1 text-destructive border-destructive hover:bg-destructive/10"
                >
                  <Trash className="h-4 w-4" />
                  Eliminar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[550px]">
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
                  onClick={() => {
                    setIsOpen(false);
                    form.reset();
                    setEditingPack(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingPack ? "Actualizar" : "Crear"} Paquete
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Packages;
