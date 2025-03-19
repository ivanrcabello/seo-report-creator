
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";

export interface KeywordCSVImportProps {
  clientId: string;
  onCancel: () => void;
  onSuccess: () => void;
  importCSV: (file: File) => Promise<boolean>;
}

export const KeywordCSVImport = ({ clientId, onCancel, onSuccess, importCSV }: KeywordCSVImportProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      if (selectedFile.type !== 'text/csv') {
        setError('Por favor, selecciona un archivo CSV válido');
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Por favor, selecciona un archivo CSV para importar');
      return;
    }
    
    try {
      setIsUploading(true);
      setError(null);
      
      const result = await importCSV(file);
      
      if (result) {
        toast.success('Palabras clave importadas correctamente');
        onSuccess();
      } else {
        setError('No se pudieron importar las palabras clave');
      }
    } catch (error) {
      console.error('Error importing keywords:', error);
      setError('Error al procesar el archivo CSV');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h3 className="text-sm font-medium mb-4">Importar palabras clave desde CSV</h3>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Archivo CSV
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-file-input"
            />
            <label 
              htmlFor="csv-file-input"
              className="cursor-pointer flex flex-col items-center justify-center"
            >
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium">
                {file ? file.name : 'Haz clic para seleccionar un archivo CSV'}
              </span>
              <span className="text-xs text-gray-500 mt-1">
                {!file && 'o arrastra y suelta aquí'}
              </span>
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            El archivo CSV debe tener las columnas: keyword, position (opcional), target_position (opcional)
          </p>
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={onCancel}
            className="mr-2"
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            size="sm" 
            disabled={!file || isUploading}
          >
            {isUploading ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-white rounded-full border-t-transparent"></div>
                Importando...
              </>
            ) : (
              'Importar palabras clave'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
