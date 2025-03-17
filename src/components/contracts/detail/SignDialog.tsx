
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SignDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSign: () => Promise<void>;
  isLoading: boolean;
}

export const SignDialog = ({ isOpen, onOpenChange, onSign, isLoading }: SignDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Firmar Contrato</DialogTitle>
          <DialogDescription>
            Al firmar este contrato, confirmas que estás de acuerdo con todos los términos y condiciones especificados.
          </DialogDescription>
        </DialogHeader>
        <div className="p-4 bg-amber-50 rounded-md my-4 border border-amber-100">
          <p className="text-sm text-amber-800">
            Esta acción no se puede deshacer. La firma quedará registrada con fecha y hora actual.
          </p>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button 
            onClick={onSign}
            disabled={isLoading}
          >
            {isLoading ? "Firmando..." : "Firmar Contrato"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
