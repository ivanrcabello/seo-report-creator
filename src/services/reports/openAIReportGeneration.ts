
import { supabase } from "@/integrations/supabase/client";
import { AuditResult } from "@/services/pdfAnalyzer";
import { toast } from "sonner";
import { getApiKeys } from "@/services/settingsService";

/**
 * Generate a report using the OpenAI API
 * @param auditData The audit data to be processed
 * @param templateType The type of report template to use (seo, local, etc.)
 * @param customPrompt Optional custom prompt to guide the AI
 * @returns The generated report content
 */
export const generateOpenAIReport = async (
  auditData: AuditResult, 
  templateType: 'seo' | 'local' | 'technical' | 'performance' = 'seo',
  customPrompt?: string
): Promise<string | null> => {
  try {
    console.log("Generating report with OpenAI API");
    console.log("Template type:", templateType);
    console.log("Custom prompt:", customPrompt || "None provided");
    console.log("Company name:", auditData.companyName);
    
    // Validate essential data
    if (!auditData || !auditData.companyName) {
      console.error("Missing required data:", { hasAuditData: !!auditData, hasCompanyName: auditData ? !!auditData.companyName : false });
      throw new Error("Datos de auditoría incompletos. Se requiere al menos el nombre de la empresa.");
    }
    
    // Get API key from the database
    const apiKeys = await getApiKeys();
    if (!apiKeys || !apiKeys.openaiApiKey) {
      console.error("No OpenAI API key found in settings");
      throw new Error("No se ha configurado la clave API de OpenAI. Por favor, configúrela en la sección de Configuración > API Keys.");
    }
    
    // Remove circular or non-serializable properties
    const sanitizedAuditData = JSON.parse(JSON.stringify(auditData));
    console.log("Audit data sanitized successfully");
    
    // Ensure custom prompt is in Spanish if provided
    const finalCustomPrompt = customPrompt 
      ? `${customPrompt} (Por favor, genera el informe en español)`
      : undefined;
    
    // Call Supabase Edge Function for OpenAI
    console.log("Calling Supabase Function: openai-report");
    const { data, error } = await supabase.functions.invoke('openai-report', {
      body: {
        auditResult: sanitizedAuditData,
        templateType,
        customPrompt: finalCustomPrompt,
        apiKey: apiKeys.openaiApiKey
      }
    });
    
    if (error) {
      console.error("Error calling OpenAI API:", error);
      throw new Error(`Error llamando a OpenAI API: ${error.message}`);
    }
    
    if (!data) {
      console.error("No data received from OpenAI API");
      throw new Error("No se recibieron datos de la API de OpenAI");
    }
    
    if (!data.content) {
      console.error("No content in OpenAI API response:", data);
      throw new Error("No se recibió contenido de la API de OpenAI");
    }
    
    console.log("Report generated successfully with OpenAI");
    console.log("Content length:", data.content.length);
    console.log("Content preview:", data.content.substring(0, 100) + "...");
    
    return data.content;
  } catch (error) {
    console.error("Error in generateOpenAIReport:", error);
    toast.error("Error generando el informe con OpenAI: " + 
      (error instanceof Error ? error.message : "Error desconocido"));
    return null;
  }
};
