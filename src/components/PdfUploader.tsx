
import { useState } from "react";
import { Upload, File, AlertCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { analyzePdf, AuditResult } from "@/services/pdfAnalyzer";

interface PdfUploaderProps {
  onAnalysisComplete: (result: AuditResult) => void;
  isLoading?: boolean; // Make isLoading optional
}

export const PdfUploader = ({ onAnalysisComplete, isLoading = false }: PdfUploaderProps) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const MAX_FILE_SIZE_MB = 25; // Aumentado a 25 MB

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        toast({
          title: "Error",
          description: "Por favor, sube un archivo PDF",
          variant: "destructive",
        });
        return;
      }

      // Verificar el tamaño del archivo
      const fileSizeMB = selectedFile.size / 1024 / 1024;
      if (fileSizeMB > MAX_FILE_SIZE_MB) {
        toast({
          title: "Error",
          description: `El archivo excede el tamaño máximo permitido de ${MAX_FILE_SIZE_MB} MB`,
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
      
      // Crear URL para vista previa
      const fileUrl = URL.createObjectURL(selectedFile);
      setFilePreview(fileUrl);

      toast({
        title: "Archivo seleccionado",
        description: `${selectedFile.name} (${(fileSizeMB).toFixed(2)} MB)`,
      });
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setLoading(true);
    try {
      // Procesar el PDF y extraer los datos
      const analysisResult = await analyzePdf(file);
      
      toast({
        title: "¡Éxito!",
        description: "PDF analizado correctamente. Visualizando resultados.",
      });
      
      // Enviar los resultados al componente padre
      onAnalysisComplete(analysisResult);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo procesar el archivo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetFile = () => {
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    setFile(null);
    setFilePreview(null);
  };

  // Use the passed isLoading prop or the local loading state
  const isUploadLoading = isLoading || loading;

  return (
    <Card className="p-6 w-full max-w-3xl mx-auto bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl animate-fadeIn">
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-full bg-blue-50 p-3">
          <Upload className="w-6 h-6 text-blue-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Subir Auditoría PDF</h3>
        <p className="text-sm text-gray-500 text-center">
          Sube tu archivo PDF con la información de la auditoría
        </p>
        
        {!file ? (
          <div className="w-full">
            <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <File className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">
                  Arrastra tu PDF aquí o haz clic para seleccionar
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={handleFileChange}
              />
            </label>
          </div>
        ) : (
          <div className="w-full space-y-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <FileText className="w-8 h-8 text-blue-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetFile}
                className="text-gray-500"
              >
                Cambiar
              </Button>
            </div>
            
            {filePreview && (
              <div className="w-full border border-gray-200 rounded-lg overflow-hidden h-48">
                <iframe
                  src={filePreview}
                  title="Vista previa del PDF"
                  className="w-full h-full"
                />
              </div>
            )}
            
            <div className="flex justify-center">
              <Button
                onClick={handleUpload}
                className="w-full max-w-md bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                disabled={isUploadLoading}
              >
                {isUploadLoading ? "Procesando..." : "Analizar PDF"}
              </Button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 text-amber-600 text-sm mt-2">
          <AlertCircle className="w-4 h-4" />
          <span>Tamaño máximo: {MAX_FILE_SIZE_MB}MB</span>
        </div>
      </div>
    </Card>
  );
};
