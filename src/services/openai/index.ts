
import { supabase } from "@/integrations/supabase/client";
import { AuditResult } from "@/services/pdfAnalyzer";
import { toast } from "sonner";

// Exporting all services from individual modules
export * from "./contentService";
export * from "./seoReportService";

// Generate SEO report using OpenAI
export const generateSEOReport = async (auditResult: AuditResult): Promise<string | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('openai-report', {
      body: { auditResult }
    });

    if (error) {
      console.error("Error generating SEO report:", error);
      throw new Error(error.message);
    }

    if (!data || !data.content) {
      throw new Error("No se recibió contenido del informe");
    }

    return data.content;
  } catch (error) {
    console.error("Error generating SEO report:", error);
    toast.error(`Error al generar el informe: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    return null;
  }
};
