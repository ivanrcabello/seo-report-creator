
import { useState } from "react";
import { Client } from "@/types/client";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteClientDialogProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (clientId: string) => Promise<boolean>;
}

export function DeleteClientDialog({ client, isOpen, onClose, onConfirm }: DeleteClientDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!client) return;
    
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      const success = await onConfirm(client.id);
      
      if (success) {
        onClose();
      } else {
        setDeleteError("No se pudo eliminar el cliente");
      }
    } catch (error) {
      console.error("Error in delete confirmation:", error);
      setDeleteError("No se pudo eliminar el cliente");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            {!deleteError ? (
              "Esta acción eliminará al cliente " + client?.name + " y no se puede deshacer. Todos los datos asociados a este cliente serán eliminados permanentemente."
            ) : (
              <span className="text-red-500 font-medium">{deleteError}</span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>
            Cancelar
          </AlertDialogCancel>
          {!deleteError && (
            <AlertDialogAction 
              onClick={handleConfirm}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
