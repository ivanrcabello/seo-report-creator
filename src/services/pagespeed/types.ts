
/**
 * Métricas principales de rendimiento de PageSpeed
 */
export interface PageSpeedMetrics {
  url: string;
  performance_score: number;
  accessibility_score: number;
  best_practices_score: number;
  seo_score: number;
  first_contentful_paint: number;
  speed_index: number;
  largest_contentful_paint: number;
  time_to_interactive: number;
  total_blocking_time: number;
  cumulative_layout_shift: number;
  timestamp: string;
}

/**
 * Elemento de auditoría de PageSpeed
 */
export interface PageSpeedAuditItem {
  id: string;
  title: string;
  description: string;
  score: number;
  scoreDisplayMode: string;
  displayValue?: string;
  category: string;
}

/**
 * Informe completo de PageSpeed
 */
export interface PageSpeedReport {
  metrics: PageSpeedMetrics;
  auditItems: PageSpeedAuditItem[];
  fullReport: any; // Reporte completo tal como lo devuelve la API
}

/**
 * Opciones para el análisis de PageSpeed
 */
export interface PageSpeedAnalysisOptions {
  url: string;
  strategy?: 'mobile' | 'desktop';
  locale?: string;
}
