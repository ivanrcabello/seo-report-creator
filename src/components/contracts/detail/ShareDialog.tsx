
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface ShareDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  shareUrl: string | null;
}

export const ShareDialog = ({ isOpen, onOpenChange, shareUrl }: ShareDialogProps) => {
  const copyToClipboard = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Enlace copiado al portapapeles");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartir Contrato</DialogTitle>
          <DialogDescription>
            Comparte este enlace con tu cliente para que pueda ver y firmar el contrato.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 mt-4">
          <Input
            value={shareUrl || ""}
            readOnly
            className="flex-1"
          />
          <Button type="submit" onClick={copyToClipboard}>
            Copiar
          </Button>
        </div>
        <div className="p-4 bg-blue-50 rounded-md my-4 border border-blue-100">
          <p className="text-sm text-blue-800">
            El cliente podrá ver y firmar el contrato usando este enlace. No se requiere inicio de sesión.
          </p>
        </div>
        <DialogFooter className="sm:justify-between">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
