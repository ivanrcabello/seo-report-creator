
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, Upload, DownloadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClientKeywords } from "./useClientKeywords";
import { ClientKeyword } from "@/services/clientKeywordsService";
import { KeywordCSVImport } from "./KeywordCSVImport";
import { toast } from "sonner";
import { ErrorAlert } from "./ErrorAlert";

interface KeywordsSectionProps {
  clientId: string;
}

export const KeywordsSection = ({ clientId }: KeywordsSectionProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showImportForm, setShowImportForm] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");
  const [position, setPosition] = useState<string>("");
  const [targetPosition, setTargetPosition] = useState<string>("10");
  
  const {
    keywords,
    isLoading,
    isSaving,
    error,
    addKeyword,
    updateKeyword,
    deleteKeyword,
    importCSV,
    fetchKeywords
  } = useClientKeywords(clientId);

  const handleAddKeyword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword.trim()) {
      toast.error("Por favor, introduce una palabra clave");
      return;
    }

    try {
      await addKeyword(
        newKeyword, 
        position ? parseInt(position) : null, 
        targetPosition ? parseInt(targetPosition) : 10
      );
      toast.success("Palabra clave añadida correctamente");
      setNewKeyword("");
      setPosition("");
      setTargetPosition("10");
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding keyword:", error);
      toast.error("No se pudo añadir la palabra clave");
    }
  };
  
  const handleRetry = () => {
    fetchKeywords();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Palabras Clave</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Palabras Clave</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorAlert error={error} retry={handleRetry} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Palabras Clave</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setShowAddForm(!showAddForm);
                setShowImportForm(false);
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Añadir
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setShowImportForm(!showImportForm);
                setShowAddForm(false);
              }}
            >
              <Upload className="h-4 w-4 mr-1" />
              Importar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {showAddForm && (
          <form onSubmit={handleAddKeyword} className="mb-6 border p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-4">Añadir nueva palabra clave</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="text-sm font-medium">Palabra clave</label>
                <input
                  type="text"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="ej. marketing digital"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Posición actual</label>
                <input
                  type="number"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="ej. 25"
                  min="0"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Posición objetivo</label>
                <input
                  type="number"
                  value={targetPosition}
                  onChange={(e) => setTargetPosition(e.target.value)}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="ej. 10"
                  min="1"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => setShowAddForm(false)}
                className="mr-2"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                size="sm" 
                disabled={isSaving || !newKeyword.trim()}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white rounded-full border-t-transparent"></div>
                    Guardando...
                  </>
                ) : "Guardar"}
              </Button>
            </div>
          </form>
        )}
        
        {showImportForm && (
          <div className="mb-6 border p-4 rounded-lg">
            <KeywordCSVImport 
              clientId={clientId} 
              onCancel={() => setShowImportForm(false)}
              onSuccess={() => {
                setShowImportForm(false);
                fetchKeywords();
              }}
              importCSV={importCSV}
            />
          </div>
        )}

        {keywords.length === 0 ? (
          <div className="text-center py-8 border border-dashed rounded-lg">
            <Search className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-gray-500">No hay palabras clave configuradas</p>
            <Button 
              variant="link" 
              onClick={() => setShowAddForm(true)}
            >
              Añadir tu primera palabra clave
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-left font-medium">Palabra clave</th>
                  <th className="py-2 px-4 text-center font-medium">Posición</th>
                  <th className="py-2 px-4 text-center font-medium">Objetivo</th>
                  <th className="py-2 px-4 text-center font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {keywords.map((keyword) => (
                  <tr key={keyword.id} className="border-b">
                    <td className="py-2 px-4">{keyword.keyword}</td>
                    <td className="py-2 px-4 text-center">
                      {keyword.position !== null ? (
                        <span className={
                          keyword.position <= 3 ? "text-green-600 font-medium" :
                          keyword.position <= 10 ? "text-amber-600 font-medium" :
                          "text-gray-600"
                        }>
                          {keyword.position}
                        </span>
                      ) : (
                        <span className="text-gray-400">No posicionada</span>
                      )}
                    </td>
                    <td className="py-2 px-4 text-center">{keyword.target_position || 10}</td>
                    <td className="py-2 px-4 text-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          if (confirm('¿Estás seguro de que deseas eliminar esta palabra clave?')) {
                            deleteKeyword(keyword.id);
                          }
                        }}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="flex justify-end mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchKeywords}
          >
            <DownloadCloud className="h-4 w-4 mr-1" />
            Actualizar lista
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
