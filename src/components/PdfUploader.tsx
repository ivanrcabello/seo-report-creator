
import { useState } from "react";
import { Upload, File, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export const PdfUploader = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

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
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setLoading(true);
    try {
      // Aquí irá la lógica para procesar el PDF
      toast({
        title: "¡Éxito!",
        description: "PDF cargado correctamente",
      });
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

  return (
    <Card className="p-6 w-full max-w-md mx-auto bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl animate-fadeIn">
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-full bg-blue-50 p-3">
          <Upload className="w-6 h-6 text-blue-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Subir Auditoría PDF</h3>
        <p className="text-sm text-gray-500 text-center">
          Sube tu archivo PDF con la información de la auditoría
        </p>
        
        <div className="w-full">
          <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <File className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">
                {file ? file.name : "Arrastra tu PDF aquí o haz clic para seleccionar"}
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

        {file && (
          <Button
            onClick={handleUpload}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            disabled={loading}
          >
            {loading ? "Procesando..." : "Analizar PDF"}
          </Button>
        )}

        <div className="flex items-center gap-2 text-amber-600 text-sm mt-2">
          <AlertCircle className="w-4 h-4" />
          <span>Tamaño máximo: 10MB</span>
        </div>
      </div>
    </Card>
  );
};
