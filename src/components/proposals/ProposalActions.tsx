
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Edit, Send, Trash, XCircle } from "lucide-react";

interface ProposalActionsProps {
  proposalId: string;
  status: string;
  isExpired: boolean;
  onDelete: () => void;
  onSend: () => void;
  onAccept: () => void;
  onReject: () => void;
}

export const ProposalActions = ({
  proposalId,
  status,
  isExpired,
  onDelete,
  onSend,
  onAccept,
  onReject
}: ProposalActionsProps) => {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    onDelete();
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="flex justify-between border-t pt-6">
      <div>
        {status === "draft" && (
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="gap-1 text-destructive border-destructive hover:bg-destructive/10">
                <Trash className="h-4 w-4" />
                Eliminar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Se eliminará permanentemente esta propuesta.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      
      <div className="flex gap-2">
        {status === "draft" && (
          <>
            <Button 
              variant="outline" 
              onClick={() => navigate(`/proposals/edit/${proposalId}`)}
              className="gap-1"
            >
              <Edit className="h-4 w-4" />
              Editar
            </Button>
            <Button 
              onClick={onSend}
              className="gap-1"
            >
              <Send className="h-4 w-4" />
              Enviar al Cliente
            </Button>
          </>
        )}
        
        {status === "sent" && !isExpired && (
          <>
            <Button 
              variant="outline" 
              className="gap-1 border-red-200 text-red-600 hover:bg-red-50"
              onClick={onReject}
            >
              <XCircle className="h-4 w-4" />
              Marcar como Rechazada
            </Button>
            <Button 
              className="gap-1 bg-green-600 hover:bg-green-700"
              onClick={onAccept}
            >
              <CheckCircle className="h-4 w-4" />
              Marcar como Aceptada
            </Button>
          </>
        )}
        
        {isExpired && (
          <Button 
            variant="outline" 
            onClick={() => navigate(`/proposals/edit/${proposalId}`)}
            className="gap-1"
          >
            <Edit className="h-4 w-4" />
            Renovar Propuesta
          </Button>
        )}
      </div>
    </div>
  );
};
