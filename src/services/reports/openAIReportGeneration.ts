
import { supabase } from "@/integrations/supabase/client";
import { AuditResult } from "@/services/pdfAnalyzer";
import { toast } from "sonner";

/**
 * Generate a report using the OpenAI API
 * @param auditData The audit data to be processed
 * @param templateType The type of report template to use (seo, local, etc.)
 * @returns The generated report content
 */
export const generateOpenAIReport = async (
  auditData: AuditResult, 
  templateType: 'seo' | 'local' | 'technical' | 'performance' = 'seo'
): Promise<string | null> => {
  try {
    console.log("Generating report with OpenAI API");
    console.log("Template type:", templateType);
    
    // Validate essential data
    if (!auditData || !auditData.companyName) {
      throw new Error("Datos de auditoría incompletos. Se requiere al menos el nombre de la empresa.");
    }
    
    // Remove circular or non-serializable properties
    const sanitizedAuditData = JSON.parse(JSON.stringify(auditData));
    console.log("Audit data sanitized successfully");
    
    // Call Supabase Edge Function for OpenAI
    console.log("Calling Supabase Function: openai-report");
    const { data, error } = await supabase.functions.invoke('openai-report', {
      body: {
        auditResult: sanitizedAuditData,
        templateType
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
    
    console.log("Report generated successfully");
    console.log("Content length:", data.content.length);
    return data.content;
  } catch (error) {
    console.error("Error in generateOpenAIReport:", error);
    toast.error("Error generando el informe con OpenAI: " + 
      (error instanceof Error ? error.message : "Error desconocido"));
    return null;
  }
};
