
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SeoPack } from "@/types/client";
import { getAllSeoPacks, addSeoPack, updateSeoPack, deleteSeoPack } from "@/services/packService";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Package } from "lucide-react";
import { toast } from "sonner";
import { PackageList } from "@/components/packages/PackageList";
import { PackageForm } from "@/components/packages/PackageForm";
import { PackFormValues } from "@/components/packages/PackageFormSchema";

const Packages = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingPack, setEditingPack] = useState<SeoPack | null>(null);
  const queryClient = useQueryClient();

  // Fetch all packages
  const { data: packages = [], isLoading } = useQuery({
    queryKey: ["packages"],
    queryFn: getAllSeoPacks
  });

  // Mutation to add a package
  const addPackMutation = useMutation({
    mutationFn: addSeoPack,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      toast.success("Paquete creado correctamente");
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error("Error al crear el paquete");
      console.error(error);
    }
  });

  // Mutation to update a package
  const updatePackMutation = useMutation({
    mutationFn: updateSeoPack,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      toast.success("Paquete actualizado correctamente");
      setIsOpen(false);
      setEditingPack(null);
    },
    onError: (error) => {
      toast.error("Error al actualizar el paquete");
      console.error(error);
    }
  });

  // Mutation to delete a package
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

  // Handle form submission
  const handleSubmit = (data: PackFormValues) => {
    // Ensure features is an array
    const featuresArray = Array.isArray(data.features) 
      ? data.features 
      : data.features.split('\n').map(item => item.trim()).filter(Boolean);
      
    if (editingPack) {
      updatePackMutation.mutate({
        ...editingPack,
        name: data.name,
        description: data.description,
        price: data.price,
        features: featuresArray,
        isActive: data.isActive
      });
    } else {
      addPackMutation.mutate({
        name: data.name,
        description: data.description,
        price: data.price,
        features: featuresArray,
        isActive: data.isActive
      });
    }
  };

  // Function to open form for editing
  const handleEdit = (pack: SeoPack) => {
    setEditingPack(pack);
    setIsOpen(true);
  };

  // Function to open form for creating
  const handleCreate = () => {
    setEditingPack(null);
    setIsOpen(true);
  };

  // Function to delete a package
  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este paquete?")) {
      deletePackMutation.mutate(id);
    }
  };

  // Function to cancel the form
  const handleCancel = () => {
    setIsOpen(false);
    setEditingPack(null);
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

      <PackageList 
        packages={packages}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <PackageForm 
            editingPack={editingPack}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Packages;
