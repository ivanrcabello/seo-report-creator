
import { SeoContract, ContractSection } from "@/types/client";
import { supabase } from "@/integrations/supabase/client";
import { getCompanySettings } from "./settingsService";
import { getClient } from "./clientService";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Helper functions to map Supabase data to app types and vice versa
const mapContractFromDB = (contract: any): SeoContract => ({
  id: contract.id,
  clientId: contract.client_id,
  title: contract.title,
  startDate: contract.start_date,
  endDate: contract.end_date,
  phase1Fee: contract.phase1_fee,
  monthlyFee: contract.monthly_fee,
  status: contract.status,
  content: contract.content,
  createdAt: contract.created_at,
  updatedAt: contract.updated_at,
  signedAt: contract.signed_at,
  signedByClient: contract.signed_by_client,
  signedByProfessional: contract.signed_by_professional,
  pdfUrl: contract.pdf_url
});

// Get all contracts
export const getContracts = async (): Promise<SeoContract[]> => {
  const { data, error } = await supabase
    .from('seo_contracts')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching contracts:", error);
    return [];
  }
  
  return (data || []).map(mapContractFromDB);
};

// Get contracts for a specific client
export const getClientContracts = async (clientId: string): Promise<SeoContract[]> => {
  const { data, error } = await supabase
    .from('seo_contracts')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching client contracts:", error);
    return [];
  }
  
  return (data || []).map(mapContractFromDB);
};

// Get a single contract by ID
export const getContract = async (id: string): Promise<SeoContract | undefined> => {
  const { data, error } = await supabase
    .from('seo_contracts')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) {
    console.error("Error fetching contract:", error);
    return undefined;
  }
  
  if (!data) return undefined;
  
  return mapContractFromDB(data);
};

// Create a new contract
export const createContract = async (contract: Omit<SeoContract, "id" | "createdAt" | "updatedAt">): Promise<SeoContract> => {
  // Cast content to any to avoid TypeScript type issues with Supabase Json type
  const { data, error } = await supabase
    .from('seo_contracts')
    .insert({
      client_id: contract.clientId,
      title: contract.title,
      start_date: contract.startDate,
      end_date: contract.endDate,
      phase1_fee: contract.phase1Fee,
      monthly_fee: contract.monthlyFee,
      status: contract.status,
      content: contract.content as any,
      signed_by_client: contract.signedByClient,
      signed_by_professional: contract.signedByProfessional,
      pdf_url: contract.pdfUrl
    })
    .select()
    .single();
  
  if (error) {
    console.error("Error creating contract:", error);
    throw error;
  }
  
  return mapContractFromDB(data);
};

// Update an existing contract
export const updateContract = async (contract: SeoContract): Promise<SeoContract> => {
  // Cast content to any to avoid TypeScript type issues with Supabase Json type
  const { data, error } = await supabase
    .from('seo_contracts')
    .update({
      client_id: contract.clientId,
      title: contract.title,
      start_date: contract.startDate,
      end_date: contract.endDate,
      phase1_fee: contract.phase1Fee,
      monthly_fee: contract.monthlyFee,
      status: contract.status,
      content: contract.content as any,
      signed_by_client: contract.signedByClient,
      signed_by_professional: contract.signedByProfessional,
      signed_at: contract.signedAt,
      pdf_url: contract.pdfUrl
    })
    .eq('id', contract.id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating contract:", error);
    throw error;
  }
  
  return mapContractFromDB(data);
};

// Delete a contract
export const deleteContract = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('seo_contracts')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting contract:", error);
    throw error;
  }
};

// Sign a contract (client or professional)
export const signContract = async (
  contractId: string, 
  signedBy: 'client' | 'professional'
): Promise<SeoContract> => {
  const now = new Date().toISOString();
  
  const updates: Record<string, any> = {
    signed_at: now
  };
  
  if (signedBy === 'client') {
    updates.signed_by_client = true;
  } else {
    updates.signed_by_professional = true;
  }
  
  const { data, error } = await supabase
    .from('seo_contracts')
    .update(updates)
    .eq('id', contractId)
    .select()
    .single();
  
  if (error) {
    console.error("Error signing contract:", error);
    throw error;
  }
  
  return mapContractFromDB(data);
};

// Create default contract sections
export const createDefaultContractSections = (): ContractSection[] => {
  return [
    {
      title: "Introducción",
      content: "El presente contrato establece los términos y condiciones bajo los cuales se prestarán los servicios de posicionamiento web (SEO).",
      order: 1
    },
    {
      title: "Servicios",
      content: "Los servicios de posicionamiento web incluyen: análisis inicial, optimización on-page, desarrollo de contenidos, optimización técnica y seguimiento de resultados.",
      order: 2
    },
    {
      title: "Primera fase",
      content: "Durante la primera fase, se realizará un análisis completo del sitio web, identificación de palabras clave objetivo, y desarrollo de una estrategia de optimización personalizada.",
      order: 3
    },
    {
      title: "Cuota mensual",
      content: "Los servicios mensuales incluyen: actualización de contenidos, monitoreo de posiciones, análisis de competidores, y reportes de rendimiento.",
      order: 4
    },
    {
      title: "Forma de pago",
      content: "El pago se realizará mediante transferencia bancaria. La primera fase se abonará al inicio del contrato, mientras que la cuota mensual se abonará en los primeros 5 días de cada mes.",
      order: 5
    },
    {
      title: "Duración del contrato",
      content: "El presente contrato tendrá una duración inicial de 6 meses, renovable automáticamente por períodos iguales salvo notificación contraria por cualquiera de las partes con al menos 30 días de antelación.",
      order: 6
    },
    {
      title: "Confidencialidad",
      content: "Ambas partes se comprometen a mantener la confidencialidad sobre la información intercambiada durante la prestación de los servicios.",
      order: 7
    },
    {
      title: "Responsabilidades",
      content: "El profesional se compromete a aplicar las mejores prácticas de SEO para mejorar el posicionamiento del sitio web. Sin embargo, debido a la naturaleza cambiante de los algoritmos de los motores de búsqueda, no puede garantizar posiciones específicas para determinadas palabras clave.",
      order: 8
    },
  ];
};

// Generate a PDF of the contract
export const generateContractPDF = async (contract: SeoContract): Promise<Blob> => {
  const client = await getClient(contract.clientId);
  const settings = await getCompanySettings();
  
  if (!client || !settings) {
    throw new Error("No se pudieron obtener los datos necesarios para generar el PDF");
  }
  
  // Create new PDF document
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });
  
  // Set font
  doc.setFont("helvetica");
  
  // Add header
  if (settings.logoUrl) {
    // Add company logo
    try {
      doc.addImage(settings.logoUrl, "PNG", 15, 10, 50, 20);
    } catch (error) {
      console.error("Error adding logo to PDF:", error);
    }
  }
  
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text("CONTRATO DE SERVICIOS SEO", 105, 20, { align: "center" });
  
  // Add contract title
  doc.setFontSize(16);
  doc.text(contract.title, 105, 30, { align: "center" });
  
  // Add date
  const dateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = new Date(contract.startDate).toLocaleDateString('es-ES', dateOptions);
  doc.setFontSize(10);
  doc.text(`Fecha: ${formattedDate}`, 195, 40, { align: "right" });
  
  // Add parties information
  doc.setFontSize(12);
  doc.text("PARTES DEL CONTRATO", 15, 50);
  
  // Professional info
  doc.setFontSize(10);
  doc.text("PROFESIONAL:", 15, 60);
  doc.text(`${settings.companyName}`, 15, 65);
  doc.text(`${settings.taxId}`, 15, 70);
  doc.text(`${settings.address}`, 15, 75);
  
  // Client info
  doc.text("CLIENTE:", 105, 60);
  doc.text(`${client.name}`, 105, 65);
  if (client.company) doc.text(`${client.company}`, 105, 70);
  if (contract.content.clientInfo.taxId) doc.text(`${contract.content.clientInfo.taxId}`, 105, 75);
  if (contract.content.clientInfo.address) doc.text(`${contract.content.clientInfo.address}`, 105, 80);
  
  // Financial info
  doc.setFontSize(12);
  doc.text("CONDICIONES ECONÓMICAS", 15, 95);
  
  doc.setFontSize(10);
  doc.text(`Primera fase: ${contract.phase1Fee.toLocaleString('es-ES')} €`, 15, 105);
  doc.text(`Cuota mensual: ${contract.monthlyFee.toLocaleString('es-ES')} €`, 15, 110);
  
  // Add sections
  let y = 125;
  for (const section of contract.content.sections) {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    
    doc.setFontSize(12);
    doc.text(section.title.toUpperCase(), 15, y);
    y += 7;
    
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(section.content, 180);
    doc.text(lines, 15, y);
    y += lines.length * 5 + 10;
  }
  
  // Add signature section if page is almost full
  if (y > 220) {
    doc.addPage();
    y = 20;
  }
  
  // Signatures section
  doc.setFontSize(12);
  doc.text("FIRMAS", 105, y + 10, { align: "center" });
  
  doc.setFontSize(10);
  doc.text("El Profesional", 50, y + 25, { align: "center" });
  doc.text("El Cliente", 160, y + 25, { align: "center" });
  
  // Add signature lines
  doc.line(20, y + 40, 80, y + 40);
  doc.line(130, y + 40, 190, y + 40);
  
  // Add signature dates
  if (contract.signedByProfessional && contract.signedAt) {
    const signedDate = new Date(contract.signedAt).toLocaleDateString('es-ES', dateOptions);
    doc.text(`Firmado: ${signedDate}`, 50, y + 45, { align: "center" });
  }
  
  if (contract.signedByClient && contract.signedAt) {
    const signedDate = new Date(contract.signedAt).toLocaleDateString('es-ES', dateOptions);
    doc.text(`Firmado: ${signedDate}`, 160, y + 45, { align: "center" });
  }
  
  // Generate the PDF blob
  const pdfBlob = doc.output('blob');
  return pdfBlob;
};

// Save the PDF to Supabase storage and update the contract
export const saveContractPDF = async (contractId: string, pdfBlob: Blob): Promise<string> => {
  const fileName = `contract_${contractId}_${Date.now()}.pdf`;
  const filePath = `contracts/${fileName}`;
  
  try {
    // Try to upload directly without checking/creating buckets first
    // This is a simpler approach that works if the bucket already exists and permissions are set correctly
    const { data, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, pdfBlob, {
        cacheControl: '3600',
        upsert: true, // Changed to true to overwrite if exists
        contentType: 'application/pdf'
      });
    
    if (uploadError) {
      // If the error is not about the bucket not existing, rethrow it
      if (!uploadError.message.includes("does not exist")) {
        throw uploadError;
      }
      
      // Fallback - if we're here, we need to handle the case where the bucket doesn't exist
      console.log("Using fallback method to save PDF...");
      // Instead of trying to create a bucket (which might fail due to RLS),
      // we'll save the file locally as a data URL and return that
      const reader = new FileReader();
      
      // Create a promise to handle the async FileReader
      const dataUrlPromise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error("Failed to convert PDF to data URL"));
          }
        };
        reader.onerror = () => reject(reader.error);
      });
      
      // Read the blob as a data URL (base64)
      reader.readAsDataURL(pdfBlob);
      
      // Wait for the FileReader to complete
      const dataUrl = await dataUrlPromise;
      
      // Update the contract with the data URL
      const { error: updateError } = await supabase
        .from('seo_contracts')
        .update({ pdf_url: dataUrl })
        .eq('id', contractId);
      
      if (updateError) {
        throw updateError;
      }
      
      return dataUrl;
    }
    
    // If upload successful, get the public URL
    const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(filePath);
    
    // Update the contract with the PDF URL
    const { error: updateError } = await supabase
      .from('seo_contracts')
      .update({ pdf_url: publicUrl })
      .eq('id', contractId);
    
    if (updateError) {
      throw updateError;
    }
    
    return publicUrl;
  } catch (error) {
    console.error("Error saving contract PDF:", error);
    throw error;
  }
};

// Generate and save contract PDF
export const generateAndSaveContractPDF = async (contractId: string): Promise<string> => {
  const contract = await getContract(contractId);
  
  if (!contract) {
    throw new Error("Contrato no encontrado");
  }
  
  const pdfBlob = await generateContractPDF(contract);
  const pdfUrl = await saveContractPDF(contractId, pdfBlob);
  
  return pdfUrl;
};
