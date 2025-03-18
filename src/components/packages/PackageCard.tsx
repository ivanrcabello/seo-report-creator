
import React, { useState, useCallback } from "react";
import { SeoPack } from "@/types/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, CheckCircle2 } from "lucide-react";
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

interface PackageCardProps {
  pack: SeoPack;
  onEdit: () => void;
  onDelete: () => void;
}

export const PackageCard = React.memo(({ pack, onEdit, onDelete }: PackageCardProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const formatCurrency = useCallback((price: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(price);
  }, []);
  
  const handleOpenDeleteDialog = useCallback(() => {
    setDeleteDialogOpen(true);
  }, []);
  
  const handleCloseDeleteDialog = useCallback(() => {
    setDeleteDialogOpen(false);
  }, []);
  
  const handleConfirmDelete = useCallback(() => {
    onDelete();
    setDeleteDialogOpen(false);
  }, [onDelete]);
  
  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle>{pack.name}</CardTitle>
            <div className="text-xl font-bold text-blue-600">{formatCurrency(pack.price)}</div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col">
          <p className="text-gray-600 mb-4">{pack.description}</p>
          
          <div className="flex-grow">
            <h4 className="font-medium text-sm mb-2">Características:</h4>
            <ul className="space-y-1">
              {pack.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" size="sm" className="gap-1" onClick={onEdit}>
              <Edit className="h-3.5 w-3.5" />
              Editar
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1 border-red-200 text-red-600 hover:bg-red-50" 
              onClick={handleOpenDeleteDialog}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Eliminar
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el paquete "{pack.name}" permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseDeleteDialog}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
});

PackageCard.displayName = 'PackageCard';
