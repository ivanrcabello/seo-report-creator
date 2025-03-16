
import { DocumentTemplate, DocumentType } from "@/types/templates";
import { createTemplate } from "./templateMutations";
import { getTemplates } from "./templateQueries";

// Create default template for SEO reports if none exists
export const createDefaultSeoReportTemplate = async (): Promise<DocumentTemplate | null> => {
  try {
    // Check if any template for SEO reports exists already
    const templates = await getTemplates('seo-report');
    if (templates.length > 0) return templates[0];
    
    // Create the default template
    const defaultTemplate: Partial<DocumentTemplate> = {
      name: "Plantilla Predeterminada de Informes SEO",
      documentType: 'seo-report',
      isDefault: true,
      sections: [
        {
          id: "introduction",
          name: "Introducción",
          content: "<h2>Introducción</h2><p>Este informe analiza el estado actual del SEO de su sitio web y proporciona recomendaciones para mejorar su visibilidad en los motores de búsqueda.</p>",
          isEnabled: true,
          order: 1
        },
        {
          id: "website-analysis",
          name: "Análisis del Sitio Web",
          content: "<h2>Análisis del Sitio Web</h2><p>A continuación se presentan los resultados del análisis técnico de su sitio web.</p>",
          isEnabled: true,
          order: 2
        },
        {
          id: "keywords",
          name: "Palabras Clave",
          content: "<h2>Análisis de Palabras Clave</h2><p>Estas son las palabras clave más relevantes para su negocio y su posicionamiento actual.</p>",
          isEnabled: true,
          order: 3
        },
        {
          id: "technical-seo",
          name: "SEO Técnico",
          content: "<h2>SEO Técnico</h2><p>Análisis de los aspectos técnicos que afectan al SEO de su sitio web.</p>",
          isEnabled: true,
          order: 4
        },
        {
          id: "recommendations",
          name: "Recomendaciones",
          content: "<h2>Recomendaciones</h2><p>Basándonos en nuestro análisis, recomendamos las siguientes acciones para mejorar el SEO de su sitio web.</p>",
          isEnabled: true,
          order: 5
        },
        {
          id: "conclusion",
          name: "Conclusión",
          content: "<h2>Conclusión</h2><p>Implementando estas recomendaciones, esperamos ver una mejora significativa en el posicionamiento de su sitio web en los próximos meses.</p>",
          isEnabled: true,
          order: 6
        }
      ],
      headerHtml: "<div style='text-align: right; font-size: 10pt; color: #666;'>{{companyName}}</div>",
      footerHtml: "<div style='text-align: center; font-size: 8pt; color: #666;'>Página {{currentPage}} de {{totalPages}} | {{companyName}}</div>",
      coverPageHtml: "<div style='text-align: center; padding-top: 100px;'><img src='{{companyLogo}}' style='max-width: 200px; margin-bottom: 50px;'><h1 style='font-size: 24pt; color: #333;'>{{reportTitle}}</h1><p style='font-size: 14pt; color: #666;'>Preparado para: {{clientName}}</p><p style='font-size: 12pt; color: #888;'>{{reportDate}}</p></div>",
      css: "h1 { color: #2563eb; font-size: 18pt; margin-bottom: 10px; } h2 { color: #1e40af; font-size: 14pt; margin-top: 20px; margin-bottom: 10px; } p { font-size: 10pt; line-height: 1.5; } table { width: 100%; border-collapse: collapse; } th { background-color: #f1f5f9; font-weight: bold; text-align: left; padding: 8px; } td { padding: 8px; border-bottom: 1px solid #e2e8f0; }"
    };
    
    return await createTemplate(defaultTemplate);
  } catch (error) {
    console.error("Error creating default template:", error);
    return null;
  }
};

// Create default template for proposals
export const createDefaultProposalTemplate = async (): Promise<DocumentTemplate | null> => {
  try {
    // Check if any template for proposals exists already
    const templates = await getTemplates('proposal');
    if (templates.length > 0) return templates[0];
    
    // Create the default template
    const defaultTemplate: Partial<DocumentTemplate> = {
      name: "Plantilla Predeterminada de Propuestas",
      documentType: 'proposal',
      isDefault: true,
      sections: [
        {
          id: "cover",
          name: "Portada",
          content: "<h1>Propuesta de Servicios SEO</h1><p>Preparada exclusivamente para {{clientName}}</p>",
          isEnabled: true,
          order: 1
        },
        {
          id: "introduction",
          name: "Introducción",
          content: "<h2>Sobre Nosotros</h2><p>{{companyName}} es una agencia especializada en optimización para motores de búsqueda con más de 5 años de experiencia en el sector.</p>",
          isEnabled: true,
          order: 2
        },
        {
          id: "client-situation",
          name: "Situación Actual del Cliente",
          content: "<h2>Análisis de Situación</h2><p>Basado en nuestro análisis inicial, hemos identificado las siguientes áreas de mejora en su presencia online:</p><ul><li>Posicionamiento actual en buscadores</li><li>Estructura técnica del sitio web</li><li>Estrategia de contenidos</li></ul>",
          isEnabled: true,
          order: 3
        },
        {
          id: "services",
          name: "Servicios Propuestos",
          content: "<h2>Servicios Recomendados</h2><p>Para mejorar su posicionamiento en buscadores, recomendamos los siguientes servicios:</p><table><tr><th>Servicio</th><th>Descripción</th></tr><tr><td>Auditoría SEO Completa</td><td>Análisis exhaustivo de todos los aspectos SEO de su sitio web</td></tr><tr><td>Optimización On-Page</td><td>Mejoras técnicas en su sitio web para facilitar el rastreo e indexación</td></tr><tr><td>Estrategia de Contenidos</td><td>Creación de contenido optimizado para palabras clave relevantes</td></tr></table>",
          isEnabled: true,
          order: 4
        },
        {
          id: "packages",
          name: "Paquetes y Precios",
          content: "<h2>Paquetes Disponibles</h2><p>Ofrecemos los siguientes paquetes de servicios:</p>",
          isEnabled: true,
          order: 5
        },
        {
          id: "timeline",
          name: "Cronograma",
          content: "<h2>Cronograma de Implementación</h2><p>El proyecto se desarrollará siguiendo estas fases:</p><ol><li><strong>Fase 1 (Semanas 1-2):</strong> Auditoría y análisis</li><li><strong>Fase 2 (Semanas 3-4):</strong> Implementación de mejoras técnicas</li><li><strong>Fase 3 (Semanas 5-8):</strong> Creación y optimización de contenidos</li><li><strong>Fase 4 (Mensual):</strong> Monitorización y ajustes</li></ol>",
          isEnabled: true,
          order: 6
        },
        {
          id: "terms",
          name: "Términos y Condiciones",
          content: "<h2>Términos y Condiciones</h2><p>Los servicios descritos en esta propuesta están sujetos a los siguientes términos:</p><ul><li>Duración mínima del contrato: 3 meses</li><li>Forma de pago: Mensual</li><li>La propuesta tiene validez de 30 días desde su emisión</li></ul>",
          isEnabled: true,
          order: 7
        }
      ],
      headerHtml: "<div style='display: flex; justify-content: space-between; font-size: 9pt; color: #666;'><div>{{companyName}}</div><div>PROPUESTA CONFIDENCIAL</div></div>",
      footerHtml: "<div style='text-align: center; font-size: 8pt; color: #666;'>Página {{currentPage}} de {{totalPages}} | {{companyName}} | {{companyEmail}}</div>",
      coverPageHtml: "<div style='text-align: center; padding-top: 100px;'><img src='{{companyLogo}}' style='max-width: 200px; margin-bottom: 70px;'><h1 style='font-size: 28pt; color: #1e40af; margin-bottom: 20px;'>PROPUESTA DE SERVICIOS SEO</h1><p style='font-size: 18pt; color: #333; margin-bottom: 40px;'>Preparada para: {{clientName}}</p><p style='font-size: 12pt; color: #666;'>{{reportDate}}</p><p style='font-size: 10pt; color: #666; margin-top: 60px;'>DOCUMENTO CONFIDENCIAL</p></div>",
      css: "h1 { color: #1e40af; font-size: 20pt; margin-bottom: 15px; } h2 { color: #2563eb; font-size: 14pt; margin-top: 25px; margin-bottom: 10px; } p { font-size: 10pt; line-height: 1.6; } ul, ol { margin-left: 20px; font-size: 10pt; } table { width: 100%; border-collapse: collapse; margin: 15px 0; } th { background-color: #e0e7ff; font-weight: bold; text-align: left; padding: 8px; border: 1px solid #cbd5e1; } td { padding: 8px; border: 1px solid #cbd5e1; }"
    };
    
    return await createTemplate(defaultTemplate);
  } catch (error) {
    console.error("Error creating default proposal template:", error);
    return null;
  }
};

// Create default template for invoices
export const createDefaultInvoiceTemplate = async (): Promise<DocumentTemplate | null> => {
  try {
    // Check if any template for invoices exists already
    const templates = await getTemplates('invoice');
    if (templates.length > 0) return templates[0];
    
    // Create the default template
    const defaultTemplate: Partial<DocumentTemplate> = {
      name: "Plantilla Predeterminada de Facturas",
      documentType: 'invoice',
      isDefault: true,
      sections: [
        {
          id: "invoice-details",
          name: "Detalles de Factura",
          content: "<div style='display: flex; justify-content: space-between;'><div><h1>FACTURA</h1><p>Nº Factura: {{invoiceNumber}}</p><p>Fecha: {{invoiceDate}}</p><p>Vencimiento: {{dueDate}}</p></div><div style='text-align: right;'><h2>{{companyName}}</h2><p>{{companyAddress}}</p><p>NIF/CIF: {{companyTaxId}}</p><p>{{companyEmail}}</p><p>{{companyPhone}}</p></div></div>",
          isEnabled: true,
          order: 1
        },
        {
          id: "client-details",
          name: "Detalles del Cliente",
          content: "<div style='margin-top: 30px; padding: 15px; background-color: #f8fafc; border-radius: 5px;'><h3>Cliente</h3><p><strong>{{clientName}}</strong></p><p>{{clientAddress}}</p><p>NIF/CIF: {{clientTaxId}}</p><p>{{clientEmail}}</p></div>",
          isEnabled: true,
          order: 2
        },
        {
          id: "items",
          name: "Conceptos",
          content: "<h3 style='margin-top: 30px;'>Conceptos</h3><table><thead><tr><th style='width: 50%;'>Descripción</th><th style='width: 15%;'>Cantidad</th><th style='width: 15%;'>Precio Unitario</th><th style='width: 20%;'>Total</th></tr></thead><tbody>{{invoiceItems}}</tbody></table>",
          isEnabled: true,
          order: 3
        },
        {
          id: "totals",
          name: "Totales",
          content: "<div style='margin-top: 20px; display: flex; justify-content: flex-end;'><table style='width: 300px;'><tr><td style='text-align: right;'><strong>Subtotal:</strong></td><td style='text-align: right;'>{{subtotal}} €</td></tr><tr><td style='text-align: right;'><strong>IVA (21%):</strong></td><td style='text-align: right;'>{{tax}} €</td></tr><tr style='font-size: 110%; font-weight: bold;'><td style='text-align: right; border-top: 1px solid #000;'>TOTAL:</td><td style='text-align: right; border-top: 1px solid #000;'>{{total}} €</td></tr></table></div>",
          isEnabled: true,
          order: 4
        },
        {
          id: "payment",
          name: "Información de Pago",
          content: "<div style='margin-top: 40px;'><h3>Información de Pago</h3><p><strong>Método de pago:</strong> {{paymentMethod}}</p><p><strong>IBAN:</strong> {{bankAccount}}</p><p><strong>Instrucciones:</strong> Por favor, realice el pago antes de la fecha de vencimiento indicando el número de factura como referencia.</p></div>",
          isEnabled: true,
          order: 5
        },
        {
          id: "notes",
          name: "Notas",
          content: "<div style='margin-top: 40px; padding: 15px; background-color: #f8fafc; border-radius: 5px;'><p><strong>Notas:</strong> {{notes}}</p></div>",
          isEnabled: true,
          order: 6
        },
        {
          id: "legal",
          name: "Información Legal",
          content: "<div style='margin-top: 40px; font-size: 8pt; color: #64748b;'><p>Esta factura ha sido emitida electrónicamente de acuerdo con el Real Decreto 1619/2012, de 30 de noviembre, por el que se aprueba el Reglamento por el que se regulan las obligaciones de facturación.</p></div>",
          isEnabled: true,
          order: 7
        }
      ],
      headerHtml: "",
      footerHtml: "<div style='text-align: center; font-size: 8pt; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 10px; margin-top: 20px;'>{{companyName}} | {{companyAddress}} | NIF/CIF: {{companyTaxId}} | {{companyEmail}} | {{companyPhone}}</div>",
      coverPageHtml: "",
      css: "body { font-family: Arial, sans-serif; } h1 { color: #1e40af; font-size: 24pt; margin-bottom: 5px; } h2 { font-size: 14pt; margin-bottom: 5px; } h3 { color: #2563eb; font-size: 12pt; margin-bottom: 10px; } p { font-size: 10pt; line-height: 1.4; margin: 3px 0; } table { width: 100%; border-collapse: collapse; margin: 15px 0; } th { background-color: #f1f5f9; font-weight: bold; text-align: left; padding: 8px; border: 1px solid #e2e8f0; } td { padding: 8px; border: 1px solid #e2e8f0; }"
    };
    
    return await createTemplate(defaultTemplate);
  } catch (error) {
    console.error("Error creating default invoice template:", error);
    return null;
  }
};

// Create default template for contracts
export const createDefaultContractTemplate = async (): Promise<DocumentTemplate | null> => {
  try {
    // Check if any template for contracts exists already
    const templates = await getTemplates('contract');
    if (templates.length > 0) return templates[0];
    
    // Create the default template
    const defaultTemplate: Partial<DocumentTemplate> = {
      name: "Plantilla Predeterminada de Contratos",
      documentType: 'contract',
      isDefault: true,
      sections: [
        {
          id: "title",
          name: "Título",
          content: "<h1 style='text-align: center;'>CONTRATO DE PRESTACIÓN DE SERVICIOS SEO</h1>",
          isEnabled: true,
          order: 1
        },
        {
          id: "parties",
          name: "Partes",
          content: "<h2>REUNIDOS</h2><p>De una parte, <strong>{{companyName}}</strong>, con NIF/CIF {{companyTaxId}}, con domicilio social en {{companyAddress}}, representada por {{companyRepresentative}}, en calidad de {{companyRepresentativePosition}}, en adelante \"EL PRESTADOR\".</p><p>Y de otra parte, <strong>{{clientName}}</strong>, con NIF/CIF {{clientTaxId}}, con domicilio en {{clientAddress}}, representada por {{clientRepresentative}}, en calidad de {{clientRepresentativePosition}}, en adelante \"EL CLIENTE\".</p><p>Ambas partes se reconocen mutuamente la capacidad legal necesaria para la firma del presente contrato y a tal efecto,</p>",
          isEnabled: true,
          order: 2
        },
        {
          id: "exponen",
          name: "Exposición",
          content: "<h2>EXPONEN</h2><p>I. Que EL PRESTADOR es una empresa especializada en servicios de optimización para motores de búsqueda (SEO).</p><p>II. Que EL CLIENTE está interesado en contratar los servicios de EL PRESTADOR para mejorar el posicionamiento de su sitio web en los motores de búsqueda.</p><p>III. Que ambas partes han acordado celebrar el presente contrato de prestación de servicios con arreglo a las siguientes:</p>",
          isEnabled: true,
          order: 3
        },
        {
          id: "clausulas",
          name: "Cláusulas",
          content: "<h2>CLÁUSULAS</h2><h3>PRIMERA - Objeto del Contrato</h3><p>El objeto del presente contrato es la prestación por parte de EL PRESTADOR de los siguientes servicios de optimización para motores de búsqueda (SEO):</p><ul><li>Auditoría SEO inicial del sitio web del CLIENTE</li><li>Implementación de mejoras técnicas en el sitio web</li><li>Optimización de contenidos existentes</li><li>Creación de nuevos contenidos optimizados</li><li>Análisis y seguimiento de palabras clave</li><li>Informes mensuales de resultados</li></ul><h3>SEGUNDA - Duración</h3><p>El presente contrato tendrá una duración inicial de {{contractDuration}} meses, comenzando el {{contractStartDate}} y finalizando el {{contractEndDate}}.</p><p>Transcurrido el periodo inicial, el contrato se renovará automáticamente por periodos iguales, salvo que cualquiera de las partes comunique a la otra su voluntad de no renovarlo con al menos 30 días de antelación a la fecha de finalización.</p><h3>TERCERA - Precio y Forma de Pago</h3><p>El precio por los servicios objeto de este contrato se establece en {{monthlyFee}} euros mensuales (IVA no incluido).</p><p>El pago se realizará mediante transferencia bancaria a la cuenta indicada por EL PRESTADOR, dentro de los primeros 5 días de cada mes.</p><h3>CUARTA - Obligaciones de EL PRESTADOR</h3><p>EL PRESTADOR se compromete a:</p><ul><li>Prestar los servicios descritos en la cláusula primera con la debida diligencia profesional</li><li>Mantener informado al CLIENTE sobre el desarrollo de los trabajos</li><li>Entregar informes mensuales detallando las acciones realizadas y los resultados obtenidos</li><li>Guardar confidencialidad sobre toda la información que reciba del CLIENTE</li></ul><h3>QUINTA - Obligaciones del CLIENTE</h3><p>EL CLIENTE se compromete a:</p><ul><li>Facilitar a EL PRESTADOR toda la información y accesos necesarios para la correcta prestación de los servicios</li><li>Efectuar los pagos en la forma y plazos establecidos</li><li>Colaborar activamente con EL PRESTADOR para la implementación de las mejoras propuestas</li></ul><h3>SEXTA - Propiedad Intelectual</h3><p>Todo el material y contenido desarrollado por EL PRESTADOR en el marco de este contrato será propiedad del CLIENTE una vez efectuado el pago correspondiente.</p><h3>SÉPTIMA - Confidencialidad</h3><p>Ambas partes se comprometen a guardar la más estricta confidencialidad sobre toda la información que reciban de la otra parte en el marco de este contrato.</p><h3>OCTAVA - Protección de Datos</h3><p>Ambas partes se comprometen a cumplir con la normativa vigente en materia de protección de datos personales.</p><h3>NOVENA - Resolución del Contrato</h3><p>El presente contrato podrá resolverse por las siguientes causas:</p><ul><li>Por mutuo acuerdo entre las partes</li><li>Por incumplimiento de cualquiera de las obligaciones establecidas en el contrato</li><li>Por la finalización del plazo establecido y la no renovación</li></ul><h3>DÉCIMA - Legislación Aplicable y Jurisdicción</h3><p>El presente contrato se regirá por la legislación española. Para la resolución de cualquier controversia que pudiera surgir en relación con el presente contrato, las partes se someten a los Juzgados y Tribunales de {{jurisdiction}}.</p>",
          isEnabled: true,
          order: 4
        },
        {
          id: "signatures",
          name: "Firmas",
          content: "<p style='margin-top: 60px;'>Y en prueba de conformidad, ambas partes firman el presente contrato por duplicado y a un solo efecto, en el lugar y fecha indicados en el encabezamiento.</p><div style='display: flex; justify-content: space-between; margin-top: 60px;'><div style='width: 45%;'><p style='border-top: 1px solid #000; padding-top: 10px;'>Por EL PRESTADOR<br>{{companyRepresentative}}<br>{{companyName}}</p></div><div style='width: 45%;'><p style='border-top: 1px solid #000; padding-top: 10px;'>Por EL CLIENTE<br>{{clientRepresentative}}<br>{{clientName}}</p></div></div>",
          isEnabled: true,
          order: 5
        }
      ],
      headerHtml: "<div style='display: flex; justify-content: space-between; font-size: 8pt; color: #666;'><div>Contrato de Servicios SEO</div><div>{{contractDate}}</div></div>",
      footerHtml: "<div style='text-align: center; font-size: 8pt; color: #666;'>Página {{currentPage}} de {{totalPages}} | {{companyName}} - {{clientName}} | Confidencial</div>",
      coverPageHtml: "<div style='text-align: center; padding-top: 150px;'><img src='{{companyLogo}}' style='max-width: 200px; margin-bottom: 80px;'><h1 style='font-size: 24pt; color: #1e40af; margin-bottom: 40px;'>CONTRATO DE PRESTACIÓN DE SERVICIOS SEO</h1><div style='margin-bottom: 40px; font-size: 14pt;'><p style='margin-bottom: 15px;'><strong>{{companyName}}</strong></p><p>y</p><p style='margin-top: 15px;'><strong>{{clientName}}</strong></p></div><p style='font-size: 12pt;'>{{contractDate}}</p></div>",
      css: "body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.6; } h1 { color: #1e40af; font-size: 18pt; margin-bottom: 20px; } h2 { color: #1e40af; font-size: 14pt; margin-top: 30px; margin-bottom: 15px; text-transform: uppercase; } h3 { color: #2563eb; font-size: 12pt; margin-top: 25px; margin-bottom: 10px; } p { margin: 10px 0; text-align: justify; } ul, ol { margin-left: 20px; margin-bottom: 15px; } li { margin-bottom: 5px; }"
    };
    
    return await createTemplate(defaultTemplate);
  } catch (error) {
    console.error("Error creating default contract template:", error);
    return null;
  }
};

// Create all default templates function
export const createAllDefaultTemplates = async (): Promise<void> => {
  try {
    await Promise.all([
      createDefaultSeoReportTemplate(),
      createDefaultProposalTemplate(),
      createDefaultInvoiceTemplate(),
      createDefaultContractTemplate()
    ]);
    console.log("Default templates created successfully");
  } catch (error) {
    console.error("Error creating default templates:", error);
  }
};
