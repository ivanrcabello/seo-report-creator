
import { DocumentTemplate } from "@/types/templates";
import { createTemplate } from "./templateMutations";
import { getTemplates } from "./templateQueries";

// Default template for SEO reports
export const createDefaultSeoReportTemplate = async (): Promise<DocumentTemplate | null> => {
  try {
    const existingTemplates = await getTemplates('seo-report');
    if (existingTemplates.length > 0) {
      console.log("Default SEO report template already exists");
      return null;
    }
    
    const template: Partial<DocumentTemplate> = {
      name: "Plantilla de Informe SEO Estándar",
      documentType: "seo-report",
      isDefault: true,
      sections: [
        {
          id: crypto.randomUUID(),
          name: "Resumen Ejecutivo",
          content: "<h2>Resumen Ejecutivo</h2><p>Este informe presenta un análisis detallado del rendimiento SEO de su sitio web y proporciona recomendaciones estratégicas para mejorar su visibilidad en los motores de búsqueda.</p>",
          isEnabled: true,
          order: 0
        },
        {
          id: crypto.randomUUID(),
          name: "Análisis de Palabras Clave",
          content: "<h2>Análisis de Palabras Clave</h2><p>Hemos analizado el rendimiento de sus palabras clave objetivo y hemos identificado oportunidades para mejorar su posicionamiento.</p>",
          isEnabled: true,
          order: 1
        },
        {
          id: crypto.randomUUID(),
          name: "Análisis Técnico",
          content: "<h2>Análisis Técnico</h2><p>Esta sección cubre los aspectos técnicos de su sitio web que afectan a su rendimiento en los motores de búsqueda.</p>",
          isEnabled: true,
          order: 2
        },
        {
          id: crypto.randomUUID(),
          name: "Recomendaciones",
          content: "<h2>Recomendaciones</h2><p>Basándonos en nuestro análisis, recomendamos las siguientes acciones para mejorar su rendimiento SEO:</p><ul><li>Mejora 1</li><li>Mejora 2</li><li>Mejora 3</li></ul>",
          isEnabled: true,
          order: 3
        }
      ],
      headerHtml: "<div class='header'><img src='[LOGO_URL]' alt='Logo' /><h1>[COMPANY_NAME]</h1></div>",
      footerHtml: "<div class='footer'><p>© [YEAR] [COMPANY_NAME]. Todos los derechos reservados.</p></div>",
      css: `
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { display: flex; align-items: center; justify-content: space-between; padding: 20px; border-bottom: 1px solid #eee; }
        .header img { max-height: 60px; }
        h1 { color: #2563eb; }
        h2 { color: #1e40af; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
        .footer { text-align: center; padding: 20px; border-top: 1px solid #eee; margin-top: 30px; }
      `
    };
    
    return await createTemplate(template);
  } catch (error) {
    console.error("Error creating default SEO report template:", error);
    return null;
  }
};

// Default template for proposals
export const createDefaultProposalTemplate = async (): Promise<DocumentTemplate | null> => {
  try {
    const existingTemplates = await getTemplates('proposal');
    if (existingTemplates.length > 0) {
      console.log("Default proposal template already exists");
      return null;
    }
    
    const template: Partial<DocumentTemplate> = {
      name: "Plantilla de Propuesta Estándar",
      documentType: "proposal",
      isDefault: true,
      sections: [
        {
          id: crypto.randomUUID(),
          name: "Introducción",
          content: "<h2>Introducción</h2><p>Gracias por la oportunidad de presentar esta propuesta. Estamos entusiasmados por la posibilidad de trabajar juntos en este proyecto.</p>",
          isEnabled: true,
          order: 0
        },
        {
          id: crypto.randomUUID(),
          name: "Objetivos",
          content: "<h2>Objetivos</h2><p>Nuestro objetivo es mejorar su presencia online y aumentar la visibilidad de su negocio mediante estrategias de SEO efectivas.</p>",
          isEnabled: true,
          order: 1
        },
        {
          id: crypto.randomUUID(),
          name: "Alcance del Trabajo",
          content: "<h2>Alcance del Trabajo</h2><p>Nuestra propuesta incluye los siguientes servicios:</p><ul><li>Auditoría SEO completa</li><li>Optimización de palabras clave</li><li>Optimización de contenido</li><li>Construcción de enlaces de calidad</li></ul>",
          isEnabled: true,
          order: 2
        },
        {
          id: crypto.randomUUID(),
          name: "Inversión",
          content: "<h2>Inversión</h2><p>La inversión para este proyecto es de [AMOUNT] euros.</p>",
          isEnabled: true,
          order: 3
        },
        {
          id: crypto.randomUUID(),
          name: "Plazos",
          content: "<h2>Plazos</h2><p>El proyecto comenzará el [START_DATE] y tendrá una duración estimada de [DURATION].</p>",
          isEnabled: true,
          order: 4
        }
      ],
      headerHtml: "<div class='header'><img src='[LOGO_URL]' alt='Logo' /><h1>[COMPANY_NAME]</h1></div>",
      footerHtml: "<div class='footer'><p>© [YEAR] [COMPANY_NAME]. Todos los derechos reservados.</p></div>",
      css: `
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { display: flex; align-items: center; justify-content: space-between; padding: 20px; border-bottom: 1px solid #eee; }
        .header img { max-height: 60px; }
        h1 { color: #2563eb; }
        h2 { color: #1e40af; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
        .footer { text-align: center; padding: 20px; border-top: 1px solid #eee; margin-top: 30px; }
      `
    };
    
    return await createTemplate(template);
  } catch (error) {
    console.error("Error creating default proposal template:", error);
    return null;
  }
};

// Default template for invoices
export const createDefaultInvoiceTemplate = async (): Promise<DocumentTemplate | null> => {
  try {
    const existingTemplates = await getTemplates('invoice');
    if (existingTemplates.length > 0) {
      console.log("Default invoice template already exists");
      return null;
    }
    
    const template: Partial<DocumentTemplate> = {
      name: "Plantilla de Factura Estándar",
      documentType: "invoice",
      isDefault: true,
      sections: [
        {
          id: crypto.randomUUID(),
          name: "Detalles de Factura",
          content: "<h2>Factura</h2><div class='invoice-details'><p><strong>Número de Factura:</strong> [INVOICE_NUMBER]</p><p><strong>Fecha de Emisión:</strong> [ISSUE_DATE]</p><p><strong>Fecha de Vencimiento:</strong> [DUE_DATE]</p></div>",
          isEnabled: true,
          order: 0
        },
        {
          id: crypto.randomUUID(),
          name: "Datos del Cliente",
          content: "<h2>Cliente</h2><div class='client-details'><p><strong>Nombre:</strong> [CLIENT_NAME]</p><p><strong>Empresa:</strong> [CLIENT_COMPANY]</p><p><strong>NIF/CIF:</strong> [CLIENT_TAX_ID]</p><p><strong>Dirección:</strong> [CLIENT_ADDRESS]</p></div>",
          isEnabled: true,
          order: 1
        },
        {
          id: crypto.randomUUID(),
          name: "Datos del Emisor",
          content: "<h2>Emisor</h2><div class='company-details'><p><strong>Nombre:</strong> [COMPANY_NAME]</p><p><strong>NIF/CIF:</strong> [COMPANY_TAX_ID]</p><p><strong>Dirección:</strong> [COMPANY_ADDRESS]</p></div>",
          isEnabled: true,
          order: 2
        },
        {
          id: crypto.randomUUID(),
          name: "Conceptos",
          content: "<h2>Conceptos</h2><table class='invoice-items'><thead><tr><th>Descripción</th><th>Cantidad</th><th>Precio</th><th>Total</th></tr></thead><tbody>[INVOICE_ITEMS]</tbody></table>",
          isEnabled: true,
          order: 3
        },
        {
          id: crypto.randomUUID(),
          name: "Resumen",
          content: "<div class='invoice-summary'><p><strong>Base Imponible:</strong> [BASE_AMOUNT] €</p><p><strong>IVA ([TAX_RATE]%):</strong> [TAX_AMOUNT] €</p><p><strong>Total:</strong> [TOTAL_AMOUNT] €</p></div>",
          isEnabled: true,
          order: 4
        }
      ],
      headerHtml: "<div class='header'><img src='[LOGO_URL]' alt='Logo' /><h1>[COMPANY_NAME]</h1></div>",
      footerHtml: "<div class='footer'><p>© [YEAR] [COMPANY_NAME]. Todos los derechos reservados.</p></div>",
      css: `
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { display: flex; align-items: center; justify-content: space-between; padding: 20px; border-bottom: 1px solid #eee; }
        .header img { max-height: 60px; }
        h1 { color: #2563eb; }
        h2 { color: #1e40af; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
        .invoice-items { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .invoice-items th, .invoice-items td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .invoice-items th { background-color: #f2f2f2; }
        .invoice-summary { margin-top: 20px; text-align: right; }
        .footer { text-align: center; padding: 20px; border-top: 1px solid #eee; margin-top: 30px; }
      `
    };
    
    return await createTemplate(template);
  } catch (error) {
    console.error("Error creating default invoice template:", error);
    return null;
  }
};

// Default template for contracts
export const createDefaultContractTemplate = async (): Promise<DocumentTemplate | null> => {
  try {
    const existingTemplates = await getTemplates('contract');
    if (existingTemplates.length > 0) {
      console.log("Default contract template already exists");
      return null;
    }
    
    const template: Partial<DocumentTemplate> = {
      name: "Plantilla de Contrato Estándar",
      documentType: "contract",
      isDefault: true,
      sections: [
        {
          id: crypto.randomUUID(),
          name: "Partes",
          content: "<h2>Partes</h2><p><strong>De una parte,</strong> [COMPANY_NAME], con NIF/CIF [COMPANY_TAX_ID], con domicilio en [COMPANY_ADDRESS], representada por [COMPANY_REPRESENTATIVE] (en adelante, el \"Profesional\").</p><p><strong>Y de otra parte,</strong> [CLIENT_NAME], con NIF/CIF [CLIENT_TAX_ID], con domicilio en [CLIENT_ADDRESS] (en adelante, el \"Cliente\").</p>",
          isEnabled: true,
          order: 0
        },
        {
          id: crypto.randomUUID(),
          name: "Objeto del Contrato",
          content: "<h2>Objeto del Contrato</h2><p>El presente contrato tiene por objeto la prestación de servicios de optimización SEO por parte del Profesional al Cliente, según las condiciones establecidas en este documento.</p>",
          isEnabled: true,
          order: 1
        },
        {
          id: crypto.randomUUID(),
          name: "Duración",
          content: "<h2>Duración</h2><p>El contrato tendrá una duración de [DURATION] meses, comenzando el [START_DATE] y finalizando el [END_DATE], pudiendo ser renovado por períodos iguales mediante acuerdo expreso de ambas partes.</p>",
          isEnabled: true,
          order: 2
        },
        {
          id: crypto.randomUUID(),
          name: "Honorarios",
          content: "<h2>Honorarios</h2><p>El Cliente abonará al Profesional la cantidad de [INITIAL_FEE] euros como pago inicial por la fase de implementación, y [MONTHLY_FEE] euros mensuales durante la vigencia del contrato.</p>",
          isEnabled: true,
          order: 3
        },
        {
          id: crypto.randomUUID(),
          name: "Forma de Pago",
          content: "<h2>Forma de Pago</h2><p>El pago se realizará mediante transferencia bancaria a la cuenta [BANK_ACCOUNT] antes del día 5 de cada mes.</p>",
          isEnabled: true,
          order: 4
        },
        {
          id: crypto.randomUUID(),
          name: "Confidencialidad",
          content: "<h2>Confidencialidad</h2><p>Ambas partes se comprometen a mantener la más estricta confidencialidad sobre toda la información a la que tengan acceso en virtud del presente contrato.</p>",
          isEnabled: true,
          order: 5
        },
        {
          id: crypto.randomUUID(),
          name: "Firmas",
          content: "<h2>Firmas</h2><div class='signatures'><div class='signature-box'><p>El Profesional:</p><p>[COMPANY_REPRESENTATIVE]</p></div><div class='signature-box'><p>El Cliente:</p><p>[CLIENT_NAME]</p></div></div>",
          isEnabled: true,
          order: 6
        }
      ],
      headerHtml: "<div class='header'><img src='[LOGO_URL]' alt='Logo' /><h1>Contrato de Servicios SEO</h1></div>",
      footerHtml: "<div class='footer'><p>© [YEAR] [COMPANY_NAME]. Todos los derechos reservados.</p></div>",
      css: `
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { display: flex; align-items: center; justify-content: space-between; padding: 20px; border-bottom: 1px solid #eee; }
        .header img { max-height: 60px; }
        h1 { color: #2563eb; }
        h2 { color: #1e40af; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
        .signatures { display: flex; justify-content: space-between; margin-top: 40px; }
        .signature-box { width: 45%; border-top: 1px solid #000; padding-top: 10px; }
        .footer { text-align: center; padding: 20px; border-top: 1px solid #eee; margin-top: 30px; }
      `
    };
    
    return await createTemplate(template);
  } catch (error) {
    console.error("Error creating default contract template:", error);
    return null;
  }
};

// Create all default templates
export const createAllDefaultTemplates = async (): Promise<void> => {
  await Promise.all([
    createDefaultSeoReportTemplate(),
    createDefaultProposalTemplate(),
    createDefaultInvoiceTemplate(),
    createDefaultContractTemplate()
  ]);
};
