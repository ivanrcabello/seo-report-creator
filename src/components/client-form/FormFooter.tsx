
import React from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Client } from "@/types/client";

type FormFooterProps = {
  client?: Client;
  onCancel: () => void;
};

export const FormFooter = ({ client, onCancel }: FormFooterProps) => {
  return (
    <div className="flex justify-between pt-2 pb-6 px-6 border-t bg-gray-50">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        className="border-gray-200 hover:bg-gray-50 flex items-center gap-1.5"
      >
        <ArrowLeft className="h-4 w-4" />
        Cancelar
      </Button>
      <Button 
        type="submit"
        className="bg-gradient-to-r from-seo-blue to-seo-purple hover:opacity-90 transition-all flex items-center gap-1.5"
      >
        <Save className="h-4 w-4" />
        {client ? "Guardar Cambios" : "Crear Cliente"}
      </Button>
    </div>
  );
};
