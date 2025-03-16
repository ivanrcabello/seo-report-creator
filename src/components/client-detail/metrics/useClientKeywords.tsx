
import { useState, useEffect } from "react";
import { 
  ClientKeyword, 
  getClientKeywords, 
  addClientKeyword, 
  updateClientKeyword, 
  deleteClientKeyword 
} from "@/services/clientKeywordsService";

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

  const handleAddKeyword = async (keyword: string, position?: number, targetPosition?: number) => {
    try {
      setIsSaving(true);
      setError(null);
      
      if (keyword.trim() === '') {
        throw new Error("La palabra clave es obligatoria");
      }
      
      const newKeyword = await addClientKeyword(clientId, keyword, position, targetPosition);
      
      if (newKeyword) {
        setKeywords(prevKeywords => [...prevKeywords, newKeyword]);
      }
    } catch (error) {
      console.error("Error adding client keyword:", error);
      
      let errorMessage = "No se pudo añadir la palabra clave";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateKeyword = async (keywordId: string, updates: Partial<ClientKeyword>) => {
    try {
      setIsSaving(true);
      setError(null);
      
      const updatedKeyword = await updateClientKeyword(keywordId, updates);
      
      if (updatedKeyword) {
        setKeywords(prevKeywords => 
          prevKeywords.map(kw => kw.id === keywordId ? updatedKeyword : kw)
        );
      }
    } catch (error) {
      console.error("Error updating client keyword:", error);
      
      let errorMessage = "No se pudo actualizar la palabra clave";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteKeyword = async (keywordId: string) => {
    try {
      setIsSaving(true);
      setError(null);
      
      const success = await deleteClientKeyword(keywordId);
      
      if (success) {
        setKeywords(prevKeywords => prevKeywords.filter(kw => kw.id !== keywordId));
      }
    } catch (error) {
      console.error("Error deleting client keyword:", error);
      
      let errorMessage = "No se pudo eliminar la palabra clave";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
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
    deleteKeyword: handleDeleteKeyword
  };
};
