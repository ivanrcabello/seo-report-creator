
import { KeywordData, TrafficData } from './types';

// Sample data for the charts
export const keywordData: KeywordData[] = [
  { month: 'Ene', top3: 2, top10: 12, top30: 28 },
  { month: 'Feb', top3: 3, top10: 15, top30: 31 },
  { month: 'Mar', top3: 5, top10: 18, top30: 34 },
  { month: 'Abr', top3: 6, top10: 18, top30: 37 },
  { month: 'May', top3: 5, top10: 16, top30: 33 },
  { month: 'Jun', top3: 8, top10: 18, top30: 36 },
];

export const trafficData: TrafficData[] = [
  { month: 'Ene', organico: 1200, referral: 400, directo: 200 },
  { month: 'Feb', organico: 1300, referral: 450, directo: 220 },
  { month: 'Mar', organico: 1500, referral: 500, directo: 250 },
  { month: 'Abr', organico: 1700, referral: 550, directo: 280 },
  { month: 'May', organico: 1900, referral: 600, directo: 300 },
  { month: 'Jun', organico: 2200, referral: 650, directo: 350 },
];
