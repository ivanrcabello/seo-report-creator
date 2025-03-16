
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileUp, Loader2, Check, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface KeywordCSVImportProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File) => Promise<boolean>;
  isImporting: boolean;
}

export const KeywordCSVImport = ({ 
  isOpen, 
  onClose, 
  onImport, 
  isImporting 
}: KeywordCSVImportProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith('.csv')) {
      toast.error("Solo se permiten archivos CSV");
      return;
    }
    
    if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error("El tamaño del archivo excede el límite de 5MB");
      return;
    }
    
    setFile(selectedFile);
    setImportSuccess(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Por favor, selecciona un archivo CSV");
      return;
    }

    try {
      const success = await onImport(file);
      if (success) {
        setImportSuccess(true);
        setTimeout(() => {
          onClose();
          setFile(null);
          setImportSuccess(false);
        }, 1500);
      }
    } catch (error) {
      console.error("Error during import:", error);
      const errorMessage = error instanceof Error ? error.message : "Error al importar el archivo";
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileUp className="h-5 w-5" />
            Importar palabras clave desde CSV
          </DialogTitle>
          <DialogDescription>
            Sube un archivo CSV con tus palabras clave para importarlas de manera masiva.
          </DialogDescription>
        </DialogHeader>
        
        <div 
          className={`border-2 border-dashed rounded-md p-8 text-center space-y-4 transition-colors
            ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'} 
            ${importSuccess ? 'border-green-500 bg-green-50' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {importSuccess ? (
            <div className="flex flex-col items-center justify-center space-y-2 text-green-600">
              <Check className="h-16 w-16" />
              <p className="font-medium">¡Importación completada con éxito!</p>
            </div>
          ) : (
            <>
              <div className="flex justify-center">
                <FileUp className="h-12 w-12 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Arrastra y suelta tu archivo CSV aquí o
                </p>
                <label htmlFor="csv-upload" className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">
                  haz clic para seleccionar
                  <input
                    id="csv-upload"
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              {file ? (
                <div className="bg-white p-2 rounded border text-left flex items-center justify-between">
                  <div className="truncate max-w-[200px]">
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className="text-gray-500 text-xs">{Math.round(file.size / 1024)} KB</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setFile(null)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <span className="sr-only">Eliminar</span>
                    Eliminar
                  </Button>
                </div>
              ) : (
                <p className="text-xs text-gray-500">CSV (max. 5MB)</p>
              )}
            </>
          )}
        </div>
        
        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm">
          <div className="flex gap-2">
            <HelpCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />
            <div>
              <p className="font-medium text-amber-800">Formato esperado del CSV:</p>
              <p className="text-amber-700 mt-1">
                El archivo debe contener columnas como: Keyword, Position, Target Position, Search Volume, etc.
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button variant="outline" onClick={onClose} disabled={isImporting}>
                  Cancelar
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Cerrar sin importar</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button 
                  onClick={handleImport} 
                  disabled={!file || isImporting || importSuccess}
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importando...
                    </>
                  ) : importSuccess ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Completado
                    </>
                  ) : (
                    <>
                      <FileUp className="mr-2 h-4 w-4" />
                      Importar
                    </>
                  )}
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Importar las palabras clave del CSV</p>
            </TooltipContent>
          </Tooltip>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
