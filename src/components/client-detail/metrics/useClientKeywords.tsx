
import { useState, useEffect } from "react";
import { 
  ClientKeyword, 
  getClientKeywords, 
  addClientKeyword, 
  updateClientKeyword, 
  deleteClientKeyword,
  addClientKeywords
} from "@/services/clientKeywordsService";
import Papa from 'papaparse';

export const useClientKeywords = (clientId: string) => {
  const [keywords, setKeywords] = useState<ClientKeyword[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchKeywords = async () => {
    try {
      if (!clientId) {
        console.log("No client ID provided, skipping keyword fetch");
        setKeywords([]);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      console.log("Fetching keywords for client ID:", clientId);
      
      const data = await getClientKeywords(clientId);
      console.log("Keywords data received:", data);
      
      setKeywords(data);
    } catch (error) {
      console.error("Error fetching client keywords:", error);
      const errorMessage = error instanceof Error ? error.message : "No se pudieron cargar las palabras clave";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddKeyword = async (keyword: string, position?: number | null, targetPosition?: number) => {
    try {
      if (!clientId) {
        throw new Error("No se ha proporcionado un ID de cliente");
      }
      
      console.log(`Adding keyword "${keyword}" with position ${position} and target ${targetPosition} for client ${clientId}`);
      
      setIsSaving(true);
      setError(null);
      
      if (keyword.trim() === '') {
        throw new Error("La palabra clave es obligatoria");
      }
      
      // Convert position to null if it's 0 to match the expected behavior in the database
      const posToSend = position === 0 ? null : position;
      
      const newKeyword = await addClientKeyword(clientId, keyword, posToSend, targetPosition || 10);
      console.log("New keyword added:", newKeyword);
      
      if (newKeyword) {
        setKeywords(prevKeywords => [...prevKeywords, newKeyword]);
      }
      
      return newKeyword;
    } catch (error) {
      console.error("Error adding client keyword:", error);
      
      let errorMessage = "No se pudo añadir la palabra clave";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateKeyword = async (keywordId: string, updates: Partial<ClientKeyword>) => {
    try {
      setIsSaving(true);
      setError(null);
      
      console.log(`Updating keyword ${keywordId} with:`, updates);
      
      // Handle position specifically to convert 0 to null
      if (updates.position === 0) {
        updates.position = null;
      }
      
      const updatedKeyword = await updateClientKeyword(keywordId, updates);
      console.log("Keyword updated:", updatedKeyword);
      
      if (updatedKeyword) {
        setKeywords(prevKeywords => 
          prevKeywords.map(kw => kw.id === keywordId ? updatedKeyword : kw)
        );
      }
      
      return updatedKeyword;
    } catch (error) {
      console.error("Error updating client keyword:", error);
      
      let errorMessage = "No se pudo actualizar la palabra clave";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteKeyword = async (keywordId: string) => {
    try {
      setIsSaving(true);
      setError(null);
      
      console.log(`Deleting keyword ${keywordId}`);
      const success = await deleteClientKeyword(keywordId);
      
      if (success) {
        setKeywords(prevKeywords => prevKeywords.filter(kw => kw.id !== keywordId));
      }
      
      return success;
    } catch (error) {
      console.error("Error deleting client keyword:", error);
      
      let errorMessage = "No se pudo eliminar la palabra clave";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleImportCSV = async (file: File): Promise<boolean> => {
    try {
      setIsSaving(true);
      setError(null);
      
      return new Promise((resolve, reject) => {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: async (results) => {
            try {
              console.log("CSV parsing results:", results);
              
              if (results.errors.length > 0) {
                console.error("CSV parsing errors:", results.errors);
                throw new Error("Error al analizar el archivo CSV");
              }
              
              const mappedKeywords = results.data.map((row: any) => {
                return {
                  keyword: row.Keyword || row.keyword || '',
                  position: row.Position !== undefined ? parseInt(row.Position) || null : null,
                  target_position: row['Target Position'] !== undefined ? parseInt(row['Target Position']) || 10 : 10,
                  search_volume: row['Search Volume'] ? parseInt(row['Search Volume']) : undefined,
                  keyword_difficulty: row['Keyword Difficulty'] ? parseInt(row['Keyword Difficulty']) : undefined,
                  cpc: row['CPC'] ? parseFloat(row['CPC']) : undefined,
                  url: row['URL'] || undefined,
                  traffic: row['Traffic'] ? parseInt(row['Traffic']) : undefined,
                  traffic_percentage: row['Traffic %'] ? parseFloat(row['Traffic %']) : undefined,
                  traffic_cost: row['Traffic Cost'] ? parseFloat(row['Traffic Cost']) : undefined,
                  competition: row['Competition'] ? parseInt(row['Competition']) : undefined,
                  trends: row['Trends'] || undefined,
                  serp_features: row['SERP Features'] || undefined,
                  keyword_intent: row['Keyword Intent'] || undefined,
                  position_type: row['Position Type'] || undefined
                };
              });
              
              console.log("Mapped keywords from CSV:", mappedKeywords);
              
              if (mappedKeywords.length === 0) {
                throw new Error("No se encontraron palabras clave en el archivo CSV");
              }
              
              const success = await addClientKeywords(clientId, mappedKeywords);
              if (success) {
                await fetchKeywords(); // Refresh the list
                resolve(true);
              } else {
                reject(new Error("Error al importar las palabras clave"));
              }
            } catch (error) {
              console.error("Error processing CSV data:", error);
              reject(error);
            }
          },
          error: (error) => {
            console.error("CSV parsing error:", error);
            reject(new Error("Error al analizar el archivo CSV"));
          }
        });
      });
    } catch (error) {
      console.error("Error importing CSV:", error);
      
      let errorMessage = "No se pudo importar el archivo CSV";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (clientId) {
      console.log("Client ID changed, fetching keywords for:", clientId);
      fetchKeywords();
    } else {
      console.log("No client ID available for keywords");
      setKeywords([]);
      setIsLoading(false);
    }
  }, [clientId]);

  return {
    keywords,
    isLoading,
    isSaving,
    error,
    fetchKeywords,
    addKeyword: handleAddKeyword,
    updateKeyword: handleUpdateKeyword,
    deleteKeyword: handleDeleteKeyword,
    importCSV: handleImportCSV
  };
};
