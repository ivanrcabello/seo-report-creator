import { Client, ClientReport, ClientDocument, SeoLocalReport } from "@/types/client";
import { v4 as uuidv4 } from "uuid";

// Mock data for clients
let clients: Client[] = [
  {
    id: "1",
    name: "Empresa Tecnológica ABC",
    email: "contacto@empresaabc.com",
    phone: "+34 912 345 678",
    company: "Tecnológica ABC S.L.",
    createdAt: "2023-09-15T10:30:00Z",
    lastReport: "2024-03-20T14:45:00Z",
    notes: ["Cliente interesado en mejorar posicionamiento en búsquedas locales", "Tiene 3 ubicaciones en Madrid"]
  },
  {
    id: "2",
    name: "Tienda Online XYZ",
    email: "info@tiendaxyz.es",
    phone: "+34 654 321 987",
    company: "Comercio XYZ S.A.",
    createdAt: "2023-11-05T09:15:00Z",
    lastReport: "2024-02-10T11:20:00Z"
  },
  {
    id: "3",
    name: "Restaurante El Buen Sabor",
    email: "reservas@elbuensabor.es",
    phone: "+34 633 222 111",
    company: "Gastronomía Ibérica S.L.",
    createdAt: "2024-01-20T16:45:00Z",
    notes: ["Negocio local con gran potencial para SEO local", "Competencia fuerte en la zona"]
  }
];

// Mock data for reports
let reports: ClientReport[] = [
  {
    id: "101",
    clientId: "1",
    title: "Análisis SEO Inicial",
    date: "2024-01-15T10:00:00Z",
    type: "seo",
    url: "https://empresaabc.com",
    notes: "Primer análisis completo del sitio corporativo."
  },
  {
    id: "102",
    clientId: "1",
    title: "Informe de Rendimiento Web",
    date: "2024-03-20T14:45:00Z",
    type: "performance",
    url: "https://empresaabc.com/productos",
    notes: "Análisis enfocado en la velocidad de carga de la sección de productos."
  },
  {
    id: "201",
    clientId: "2",
    title: "Auditoría SEO Completa",
    date: "2024-02-10T11:20:00Z",
    type: "seo",
    url: "https://tiendaxyz.es",
    notes: "Análisis de keywords y posicionamiento para tienda online."
  }
];

// Mock data for documents
let documents: ClientDocument[] = [
  {
    id: "d101",
    clientId: "1",
    name: "Análisis competencia.pdf",
    type: "pdf",
    url: "/mock-files/analisis.pdf",
    uploadDate: "2024-02-10T09:30:00Z",
    analyzedStatus: "processed"
  },
  {
    id: "d102",
    clientId: "1",
    name: "Estudio de mercado.pdf",
    type: "pdf",
    url: "/mock-files/estudio-mercado.pdf",
    uploadDate: "2024-03-05T14:20:00Z",
    analyzedStatus: "processed"
  },
  {
    id: "d201",
    clientId: "2",
    name: "Captura de métricas actuales.png",
    type: "image",
    url: "/mock-files/metricas.png",
    uploadDate: "2024-01-25T11:10:00Z",
    analyzedStatus: "processed"
  }
];

// Mock data for local SEO reports
let localSeoReports: SeoLocalReport[] = [
  {
    id: "ls101",
    clientId: "3",
    title: "Informe SEO Local - Restaurante El Buen Sabor",
    date: "2024-03-15T10:00:00Z",
    businessName: "Restaurante El Buen Sabor",
    location: "Madrid, Centro",
    googleMapsRanking: 12,
    localListings: [
      { platform: "Google Business Profile", status: "claimed" },
      { platform: "Yelp", status: "unclaimed" },
      { platform: "TripAdvisor", url: "https://tripadvisor.com/el-buen-sabor", status: "claimed" }
    ],
    keywordRankings: [
      { keyword: "restaurante español madrid centro", position: 15, localPosition: 5 },
      { keyword: "tapas madrid centro", position: 28, localPosition: 10 },
      { keyword: "mejor cocina casera madrid", position: 34, localPosition: 8 }
    ],
    recommendations: [
      "Reclamar perfil en Yelp para mejorar presencia local",
      "Añadir fotos actualizadas del local en Google Business Profile",
      "Mejorar la consistencia NAP (Nombre, Dirección, Teléfono) en todos los directorios",
      "Implementar schema markup para restaurantes en la web"
    ]
  }
];

// Client CRUD operations
export const getClients = (): Client[] => {
  return [...clients];
};

export const getClient = (id: string): Client | undefined => {
  return clients.find(client => client.id === id);
};

export const addClient = (client: Omit<Client, "id" | "createdAt">): Client => {
  const newClient: Client = {
    id: uuidv4(),
    ...client,
    createdAt: new Date().toISOString()
  };
  clients = [...clients, newClient];
  return newClient;
};

export const updateClient = (client: Client): Client => {
  clients = clients.map(c => c.id === client.id ? client : c);
  return client;
};

export const deleteClient = (id: string): void => {
  clients = clients.filter(client => client.id !== id);
  // Also delete associated reports
  reports = reports.filter(report => report.clientId !== id);
};

// Report CRUD operations
export const getClientReports = (clientId: string): ClientReport[] => {
  return reports.filter(report => report.clientId === clientId);
};

export const getAllReports = (): ClientReport[] => {
  return [...reports];
};

export const getReport = (id: string): ClientReport | undefined => {
  return reports.find(report => report.id === id);
};

export const addReport = (report: Omit<ClientReport, "id">): ClientReport => {
  const newReport: ClientReport = {
    id: uuidv4(),
    ...report
  };
  reports = [...reports, newReport];
  
  // Update client's lastReport date
  const client = clients.find(c => c.id === report.clientId);
  if (client) {
    client.lastReport = report.date;
    updateClient(client);
  }
  
  return newReport;
};

export const updateReport = (report: ClientReport): ClientReport => {
  reports = reports.map(r => r.id === report.id ? report : r);
  return report;
};

export const deleteReport = (id: string): void => {
  reports = reports.filter(report => report.id !== id);
};

// Document operations
export const getClientDocuments = (clientId: string): ClientDocument[] => {
  return documents.filter(doc => doc.clientId === clientId);
};

export const getAllDocuments = (): ClientDocument[] => {
  return [...documents];
};

export const getDocument = (id: string): ClientDocument | undefined => {
  return documents.find(doc => doc.id === id);
};

export const addDocument = (document: Omit<ClientDocument, "id">): ClientDocument => {
  const newDocument: ClientDocument = {
    id: uuidv4(),
    ...document
  };
  documents = [...documents, newDocument];
  return newDocument;
};

export const updateDocument = (document: ClientDocument): ClientDocument => {
  documents = documents.map(d => d.id === document.id ? document : d);
  return document;
};

export const deleteDocument = (id: string): void => {
  documents = documents.filter(doc => doc.id !== id);
};

// Client Notes operations
export const addClientNote = (clientId: string, note: string): Client | undefined => {
  const client = clients.find(c => c.id === clientId);
  if (client) {
    if (!client.notes) {
      client.notes = [];
    }
    client.notes.push(note);
    updateClient(client);
    return client;
  }
  return undefined;
};

export const removeClientNote = (clientId: string, index: number): Client | undefined => {
  const client = clients.find(c => c.id === clientId);
  if (client && client.notes && index >= 0 && index < client.notes.length) {
    client.notes.splice(index, 1);
    updateClient(client);
    return client;
  }
  return undefined;
};

// Local SEO report operations
export const getLocalSeoReports = (clientId: string): SeoLocalReport[] => {
  return localSeoReports.filter(report => report.clientId === clientId);
};

export const getLocalSeoReport = (id: string): SeoLocalReport | undefined => {
  return localSeoReports.find(report => report.id === id);
};

export const addLocalSeoReport = (report: Omit<SeoLocalReport, "id">): SeoLocalReport => {
  const newReport: SeoLocalReport = {
    id: uuidv4(),
    ...report
  };
  localSeoReports = [...localSeoReports, newReport];
  
  // Update client's lastReport date
  const client = clients.find(c => c.id === report.clientId);
  if (client) {
    client.lastReport = report.date;
    updateClient(client);
  }
  
  return newReport;
};

export const updateLocalSeoReport = (report: SeoLocalReport): SeoLocalReport => {
  localSeoReports = localSeoReports.map(r => r.id === report.id ? report : r);
  return report;
};

export const deleteLocalSeoReport = (id: string): void => {
  localSeoReports = localSeoReports.filter(report => report.id !== id);
};

// Add the missing shareReport function
export const shareReport = async (report: ClientReport): Promise<ClientReport> => {
  if (!report.shareToken) {
    report.shareToken = uuidv4();
  }
  report.sharedAt = new Date().toISOString();
  
  // Update the report in the collection
  reports = reports.map(r => r.id === report.id ? report : r);
  
  return report;
};
