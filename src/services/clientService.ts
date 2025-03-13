
import { Client, ClientReport } from "@/types/client";
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
    lastReport: "2024-03-20T14:45:00Z"
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
