
import jsPDF from 'jspdf';
import { SeoContract } from '@/types/client';
import { getClient } from '@/services/clientService';
import { getCompanySettings } from '@/services/settingsService';
import { supabase } from '@/integrations/supabase/client';

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
    // Upload the PDF to Supabase storage
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(filePath, pdfBlob, {
        cacheControl: '3600',
        upsert: true,
        contentType: 'application/pdf'
      });
    
    if (error) {
      console.error("Error uploading PDF to storage:", error);
      
      // If upload fails, fallback to data URL approach
      const reader = new FileReader();
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
      const dataUrl = await dataUrlPromise;
      
      // Update the contract with the data URL
      await supabase
        .from('seo_contracts')
        .update({ pdf_url: dataUrl })
        .eq('id', contractId);
      
      return dataUrl;
    }
    
    // Get the public URL of the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);
    
    // Update the contract with the PDF URL
    await supabase
      .from('seo_contracts')
      .update({ pdf_url: publicUrl })
      .eq('id', contractId);
    
    return publicUrl;
  } catch (error) {
    console.error("Error saving contract PDF:", error);
    throw error;
  }
};
