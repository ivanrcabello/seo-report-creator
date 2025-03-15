
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Upload, File, AlertCircle, Loader2 } from "lucide-react";
import { getFileType, extractFileContent } from "@/services/documentService";

interface FileUploaderProps {
  onFileUpload: (file: File, content: string, type: "pdf" | "image" | "doc" | "text") => Promise<void>;
  isLoading: boolean;
  allowedTypes?: string[];
  maxSizeMB?: number;
}

export const FileUploader = ({ 
  onFileUpload, 
  isLoading, 
  allowedTypes = [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx", ".txt"],
  maxSizeMB = 25
}: FileUploaderProps) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (isLoading) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await processFile(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLoading) return;
    
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
      // Reset the input value so the same file can be uploaded again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const processFile = async (file: File) => {
    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast({
        title: "Archivo demasiado grande",
        description: `El tamaño máximo permitido es ${maxSizeMB}MB`,
        variant: "destructive",
      });
      return;
    }
    
    // Check file type
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (!allowedTypes.includes(fileExtension)) {
      toast({
        title: "Tipo de archivo no permitido",
        description: `Los tipos de archivo permitidos son: ${allowedTypes.join(", ")}`,
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Extract content for analysis
      const content = await extractFileContent(file);
      const fileType = getFileType(file);
      
      // Call the callback
      await onFileUpload(file, content, fileType);
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "Error al procesar el archivo",
        description: "No se pudo procesar el archivo. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isLoading && fileInputRef.current?.click()}
        >
          {isLoading ? (
            <div className="flex flex-col items-center text-center">
              <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
              <p className="text-lg font-medium text-gray-700">Procesando archivo...</p>
              <p className="text-sm text-gray-500 mt-2">
                Por favor, espera mientras procesamos tu archivo
              </p>
            </div>
          ) : (
            <>
              <Upload className="h-10 w-10 text-blue-500 mb-4" />
              <p className="text-lg font-medium text-gray-700">Arrastra un archivo aquí</p>
              <p className="text-sm text-gray-500 mt-2">
                o haz clic para seleccionar un archivo
              </p>
              <p className="text-xs text-gray-400 mt-4">
                Tipos de archivo permitidos: {allowedTypes.join(", ")}
              </p>
              <p className="text-xs text-gray-400">
                Tamaño máximo: {maxSizeMB}MB
              </p>
            </>
          )}
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept={allowedTypes.join(",")}
            disabled={isLoading}
          />
        </div>

        {isLoading && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-700">Procesando archivo</p>
              <p className="text-xs text-blue-600 mt-1">
                Los archivos más grandes pueden tardar más tiempo en procesarse.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
