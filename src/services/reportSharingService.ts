
import { v4 as uuidv4 } from "uuid";
import { ClientReport, SeoLocalReport, AnalyticsData, SearchConsoleData } from "@/types/client";

// Mock data for Analytics
const generateMockAnalyticsData = (clientId: string): AnalyticsData => {
  return {
    sessionCount: Math.floor(Math.random() * 10000) + 1000,
    userCount: Math.floor(Math.random() * 8000) + 800,
    pageViews: Math.floor(Math.random() * 30000) + 3000,
    bounceRate: Math.random() * 70 + 10,
    avgSessionDuration: Math.floor(Math.random() * 180) + 60,
    topPages: [
      {
        path: "/",
        views: Math.floor(Math.random() * 5000) + 1000,
        avgTimeOnPage: Math.floor(Math.random() * 120) + 30
      },
      {
        path: "/services",
        views: Math.floor(Math.random() * 3000) + 500,
        avgTimeOnPage: Math.floor(Math.random() * 100) + 20
      },
      {
        path: "/about",
        views: Math.floor(Math.random() * 2000) + 300,
        avgTimeOnPage: Math.floor(Math.random() * 90) + 15
      },
      {
        path: "/contact",
        views: Math.floor(Math.random() * 1500) + 200,
        avgTimeOnPage: Math.floor(Math.random() * 80) + 10
      }
    ],
    trafficBySource: [
      {
        source: "Organic Search",
        sessions: Math.floor(Math.random() * 5000) + 1000,
        percentage: Math.random() * 40 + 10
      },
      {
        source: "Direct",
        sessions: Math.floor(Math.random() * 3000) + 500,
        percentage: Math.random() * 30 + 10
      },
      {
        source: "Referral",
        sessions: Math.floor(Math.random() * 2000) + 300,
        percentage: Math.random() * 20 + 5
      },
      {
        source: "Social",
        sessions: Math.floor(Math.random() * 1500) + 200,
        percentage: Math.random() * 15 + 5
      }
    ],
    conversionRate: Math.random() * 10 + 1,
    timeRange: {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      to: new Date().toISOString()
    }
  };
};

// Mock data for Search Console
const generateMockSearchConsoleData = (clientId: string): SearchConsoleData => {
  return {
    totalClicks: Math.floor(Math.random() * 5000) + 500,
    totalImpressions: Math.floor(Math.random() * 100000) + 10000,
    avgCtr: Math.random() * 10 + 1,
    avgPosition: Math.random() * 50 + 1,
    topQueries: [
      {
        query: "empresa servicios",
        clicks: Math.floor(Math.random() * 500) + 50,
        impressions: Math.floor(Math.random() * 5000) + 500,
        ctr: Math.random() * 15 + 1,
        position: Math.random() * 20 + 1
      },
      {
        query: "nombre empresa",
        clicks: Math.floor(Math.random() * 400) + 40,
        impressions: Math.floor(Math.random() * 4000) + 400,
        ctr: Math.random() * 14 + 1,
        position: Math.random() * 15 + 1
      },
      {
        query: "servicios empresa ciudad",
        clicks: Math.floor(Math.random() * 300) + 30,
        impressions: Math.floor(Math.random() * 3000) + 300,
        ctr: Math.random() * 13 + 1,
        position: Math.random() * 10 + 1
      },
      {
        query: "contratar servicios",
        clicks: Math.floor(Math.random() * 200) + 20,
        impressions: Math.floor(Math.random() * 2000) + 200,
        ctr: Math.random() * 12 + 1,
        position: Math.random() * 30 + 1
      }
    ],
    topPages: [
      {
        page: "/",
        clicks: Math.floor(Math.random() * 1000) + 100,
        impressions: Math.floor(Math.random() * 10000) + 1000,
        ctr: Math.random() * 15 + 1,
        position: Math.random() * 10 + 1
      },
      {
        page: "/services",
        clicks: Math.floor(Math.random() * 800) + 80,
        impressions: Math.floor(Math.random() * 8000) + 800,
        ctr: Math.random() * 14 + 1,
        position: Math.random() * 15 + 1
      },
      {
        page: "/about",
        clicks: Math.floor(Math.random() * 600) + 60,
        impressions: Math.floor(Math.random() * 6000) + 600,
        ctr: Math.random() * 13 + 1,
        position: Math.random() * 20 + 1
      }
    ],
    timeRange: {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      to: new Date().toISOString()
    }
  };
};

// Función para generar un token de compartir para un informe
export const generateShareToken = (): string => {
  return uuidv4();
};

// Función para generar una URL pública para la propuesta
export const generatePublicProposalUrl = (proposalId: string): string => {
  // En una implementación real, esta URL apuntaría a un dominio público
  return `${window.location.origin}/proposal-share/${proposalId}`;
};

// Función para compartir un informe SEO
export const shareReport = async (report: ClientReport): Promise<ClientReport> => {
  const now = new Date().toISOString();
  const updatedReport: ClientReport = {
    ...report,
    shareToken: generateShareToken(),
    sharedAt: now
  };
  
  return updatedReport;
};

// Función para compartir un informe SEO local
export const shareLocalSeoReport = async (report: SeoLocalReport): Promise<SeoLocalReport> => {
  const now = new Date().toISOString();
  const updatedReport: SeoLocalReport = {
    ...report,
    shareToken: generateShareToken(),
    sharedAt: now
  };
  
  return updatedReport;
};

// Función para obtener datos de Google Analytics
export const fetchAnalyticsData = async (clientId: string): Promise<AnalyticsData> => {
  // En una implementación real, aquí se conectaría con la API de Google Analytics
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockAnalyticsData(clientId));
    }, 1000);
  });
};

// Función para obtener datos de Search Console
export const fetchSearchConsoleData = async (clientId: string): Promise<SearchConsoleData> => {
  // En una implementación real, aquí se conectaría con la API de Google Search Console
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockSearchConsoleData(clientId));
    }, 1000);
  });
};

// Función para conectar una cuenta de Google Analytics
export const connectGoogleAnalytics = async (clientId: string, accountData: any): Promise<boolean> => {
  // En una implementación real, aquí se gestionaría la conexión con Google Analytics
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
};

// Función para conectar una cuenta de Google Search Console
export const connectSearchConsole = async (clientId: string, accountData: any): Promise<boolean> => {
  // En una implementación real, aquí se gestionaría la conexión con Google Search Console
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
};
