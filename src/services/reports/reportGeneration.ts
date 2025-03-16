
import { supabase } from "@/integrations/supabase/client";
import { AuditResult } from "@/services/pdfAnalyzer";
import { toast } from "sonner";

/**
 * Generate a report using the Gemini API
 * @param auditData The audit data to be processed
 * @param templateType The type of report template to use (seo, local, etc.)
 * @returns The generated report content
 */
export const generateGeminiReport = async (
  auditData: AuditResult, 
  templateType: 'seo' | 'local' | 'technical' | 'performance' = 'seo'
): Promise<string | null> => {
  try {
    console.log("Generating report with Gemini API");
    console.log("Template type:", templateType);
    console.log("Audit data:", JSON.stringify(auditData, null, 2));
    
    // Validate essential data
    if (!auditData || !auditData.companyName) {
      throw new Error("Datos de auditoría incompletos. Se requiere al menos el nombre de la empresa.");
    }
    
    // Call the Supabase Edge Function for Gemini
    console.log("Calling Supabase Function: gemini-report");
    const { data, error } = await supabase.functions.invoke('gemini-report', {
      body: {
        auditData,
        templateType
      }
    });
    
    if (error) {
      console.error("Error calling Gemini API:", error);
      throw new Error(`Error llamando a Gemini API: ${error.message}`);
    }
    
    if (!data) {
      console.error("No data received from Gemini API");
      throw new Error("No se recibieron datos de la API de Gemini");
    }
    
    if (!data.content) {
      console.error("No content in Gemini API response:", data);
      throw new Error("No se recibió contenido de la API de Gemini");
    }
    
    console.log("Report generated successfully");
    console.log("Content length:", data.content.length);
    return data.content;
  } catch (error) {
    console.error("Error in generateGeminiReport:", error);
    toast.error("Error generando el informe con Gemini: " + 
      (error instanceof Error ? error.message : "Error desconocido"));
    return null;
  }
};
