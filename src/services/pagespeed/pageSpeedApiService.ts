
// Import axios u otra librería para hacer peticiones HTTP
import axios from 'axios';
import { PageSpeedReport, PageSpeedAudit } from "../pagespeed";

// Clave API para PageSpeed Insights (debe estar configurada en el .env)
const API_KEY = import.meta.env.VITE_PAGESPEED_API_KEY;

export const analyzeWebsite = async (url: string): Promise<PageSpeedReport> => {
  try {
    console.log("Analyzing URL with PageSpeed Insights:", url);
    
    // Si estamos en desarrollo y no hay API_KEY, usamos datos de prueba
    if (!API_KEY && import.meta.env.DEV) {
      console.log("Using mock PageSpeed data for development");
      return generateMockData(url);
    }
    
    // Construir la URL de la API
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${API_KEY}&strategy=mobile&category=performance&category=seo&category=best-practices&category=accessibility`;
    
    // Realizar la petición a la API
    const response = await axios.get(apiUrl);
    
    if (response.status !== 200) {
      console.error("PageSpeed API responded with status:", response.status);
      throw new Error(`PageSpeed API responded with status: ${response.status}`);
    }
    
    const data = response.data;
    console.log("PageSpeed API response received");
    
    // Procesar y mapear los datos de la respuesta
    return processPageSpeedResponse(data, url);
  } catch (error) {
    console.error("Error calling PageSpeed API:", error);
    
    // En desarrollo, si falla, usamos datos simulados
    if (import.meta.env.DEV) {
      console.log("Falling back to mock data in development");
      return generateMockData(url);
    }
    
    throw error;
  }
};

// Función para procesar la respuesta de la API
const processPageSpeedResponse = (data: any, url: string): PageSpeedReport => {
  try {
    // Extraer categorías y puntuaciones
    const categories = data.lighthouseResult?.categories || {};
    const audits = data.lighthouseResult?.audits || {};
    
    // Extraer puntuaciones de las categorías
    const performanceScore = (categories.performance?.score || 0);
    const seoScore = (categories.seo?.score || 0);
    const bestPracticesScore = (categories['best-practices']?.score || 0);
    const accessibilityScore = (categories.accessibility?.score || 0);
    
    // Extraer métricas principales
    const firstContentfulPaint = parseFloat(audits['first-contentful-paint']?.numericValue) || 0;
    const speedIndex = parseFloat(audits['speed-index']?.numericValue) || 0;
    const largestContentfulPaint = parseFloat(audits['largest-contentful-paint']?.numericValue) || 0;
    const timeToInteractive = parseFloat(audits['interactive']?.numericValue) || 0;
    const totalBlockingTime = parseFloat(audits['total-blocking-time']?.numericValue) || 0;
    const cumulativeLayoutShift = parseFloat(audits['cumulative-layout-shift']?.numericValue) || 0;
    
    // Convertir audits a nuestro formato
    const formattedAudits: PageSpeedAudit[] = Object.entries(audits).map(([id, audit]: [string, any]) => {
      // Asegurarnos de que score es un número entre 0 y 1
      let score = typeof audit.score === 'number' ? audit.score : null;
      
      // Si score es null, intentamos usar el displayValue para inferir un score
      if (score === null && audit.displayValue) {
        const numericMatch = audit.displayValue.match(/(\d+(\.\d+)?)/);
        if (numericMatch) {
          const numericValue = parseFloat(numericMatch[0]);
          // Convertir a un valor entre 0 y 1 si parece razonable
          if (numericValue <= 1) {
            score = numericValue;
          } else if (numericValue <= 100) {
            score = numericValue / 100;
          }
        }
      }
      
      // Si score sigue siendo null, usamos un valor predeterminado de 0.5
      if (score === null) {
        score = 0.5;
      }
      
      // Determinamos la categoría del audit
      let category = 'other';
      if (audit.group === 'metrics') {
        category = 'performance';
      } else if (audit.group === 'seo') {
        category = 'seo';
      } else if (audit.group === 'best-practices') {
        category = 'best-practices';
      } else if (audit.group === 'a11y') {
        category = 'accessibility';
      }
      
      return {
        id,
        title: audit.title || id,
        description: audit.description || '',
        score,
        displayValue: audit.displayValue || '',
        details: audit.details || null,
        category
      };
    });
    
    // Devolver el informe completo
    return {
      id: `pagespeed-${Date.now()}`,
      timestamp: new Date().toISOString(),
      url: url,
      metrics: {
        url: url,
        performance_score: Number(performanceScore),
        seo_score: Number(seoScore),
        best_practices_score: Number(bestPracticesScore),
        accessibility_score: Number(accessibilityScore),
        first_contentful_paint: Number(firstContentfulPaint),
        speed_index: Number(speedIndex),
        largest_contentful_paint: Number(largestContentfulPaint),
        time_to_interactive: Number(timeToInteractive),
        total_blocking_time: Number(totalBlockingTime),
        cumulative_layout_shift: Number(cumulativeLayoutShift)
      },
      audits: formattedAudits
    };
  } catch (error) {
    console.error("Error processing PageSpeed response:", error);
    throw new Error("Could not process PageSpeed API response");
  }
};

// Función para generar datos de prueba para desarrollo
const generateMockData = (url: string): PageSpeedReport => {
  const timestamp = new Date().toISOString();
  
  console.log("Generating mock PageSpeed data for:", url);
  
  // Generar puntuaciones aleatorias para los audits
  const audits: PageSpeedAudit[] = [];
  const categories = ['performance', 'seo', 'best-practices', 'accessibility'];
  
  // Generar algunos audits aleatorios
  for (let i = 1; i <= 20; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const score = Math.random();
    
    audits.push({
      id: `mock-audit-${i}`,
      title: `Audit de prueba ${i}`,
      description: `Esta es una descripción de prueba para el audit ${i}`,
      score,
      displayValue: score >= 0.9 ? 'Excelente' : score >= 0.5 ? 'Necesita mejoras' : 'Deficiente',
      details: null,
      category
    });
  }
  
  // Generar métricas aleatorias
  const performance_score = Math.random();
  const seo_score = Math.random();
  const best_practices_score = Math.random();
  const accessibility_score = Math.random();
  
  return {
    id: `mock-pagespeed-${Date.now()}`,
    timestamp,
    url,
    metrics: {
      url,
      performance_score: Number(performance_score.toFixed(2)),
      seo_score: Number(seo_score.toFixed(2)),
      best_practices_score: Number(best_practices_score.toFixed(2)),
      accessibility_score: Number(accessibility_score.toFixed(2)),
      first_contentful_paint: Number((Math.random() * 5000).toFixed(0)),
      speed_index: Number((Math.random() * 6000).toFixed(0)),
      largest_contentful_paint: Number((Math.random() * 7000).toFixed(0)),
      time_to_interactive: Number((Math.random() * 8000).toFixed(0)),
      total_blocking_time: Number((Math.random() * 1000).toFixed(0)),
      cumulative_layout_shift: Number((Math.random() * 0.5).toFixed(2))
    },
    audits
  };
};
