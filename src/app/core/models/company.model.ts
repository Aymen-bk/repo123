export interface TrendPoint {
  date: string;          // e.g. '2025-Q1'
  global_score: number;
}

export interface Level3Metric {
  metric_name: string;
  score: number | null;
  sources: string[];
  user_friendly_explanation: string[];
  information: string[];
  score_explanation_english: string[];
  score_explanation_french: string[];
}

export interface Level2Metric {
  metric_name: string;
  average_score: number;
  level_3_metrics: Level3Metric[];
}

export interface CategoryDetail {
  category: 'Governance' | 'People' | 'Planet';
  average_score: number;
  level_2_metrics: Level2Metric[];
}

export interface HumankindResponse {
  global_score: number;
  processing_time: number;
  category_details: CategoryDetail[];
}

export interface Company {
  company_id: string;
  company_name: string;
  company_ticker: string;
  country: string;
  head_quarter_iso_2_code: string;
  industry: string;
  company_type: string;
  website: string;
  investor_website: string;
  company_logo: string | null;
  Source: string;
  status: string;
  is_current: boolean;
  timestamp: string;
  humankind_response: HumankindResponse;
  score_history?: TrendPoint[];
}

export interface SearchFilters {
  query: string;
  industry: string;
  country: string;
  minScore: number;
  maxScore: number;
}
