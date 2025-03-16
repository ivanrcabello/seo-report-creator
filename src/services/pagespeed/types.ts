
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
}

export interface PageSpeedAudit {
  id: string;
  title: string;
  description: string;
  score: number;
  scoreDisplayMode: string;
  displayValue?: string;
  category: 'performance' | 'accessibility' | 'best-practices' | 'seo';
  importance: 'high' | 'medium' | 'low';
  details?: any;
}

export interface PageSpeedReport {
  id?: string;
  metrics: PageSpeedMetrics;
  audits: PageSpeedAudit[];
  created_at?: string;
}
