import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Company } from '../models/company.model';
import { TrendPoint } from '../models/company.model';

export interface CompanyListItem {
  company_id: string;
  company_name: string;
  company_ticker: string;
  country: string;
  head_quarter_iso_2_code: string;
  industry: string;
  global_score: number | null;
}

export interface CompanyTrend {
  company_id: string;
  company_name: string;
  company_ticker: string;
  history: TrendPoint[];
}

@Injectable({ providedIn: 'root' })
export class CompanyApiService {
  private http = inject(HttpClient);
  private base = 'http://localhost:8081/api';

  importCompanies(file: File) {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<{ importedCount: number; ids: string[] }>(`${this.base}/import/companies`, form);
  }

  searchCompanies(params: { q?: string; industry?: string; country?: string; minScore?: number; maxScore?: number }) {
    return this.http.get<CompanyListItem[]>(`${this.base}/companies`, { params: params as any });
  }

  getCompany(id: string) {
    return this.http.get<Company>(`${this.base}/companies/${encodeURIComponent(id)}`);
  }

  /** POST /api/companies — single company manual entry */
  createCompany(body: object) {
    return this.http.post<{ id: string }>(`${this.base}/companies`, body);
  }

  /** GET /api/compare?ids=id1,id2,... — batch fetch full company docs */
  compareCompanies(ids: string[]) {
    return this.http.get<Company[]>(`${this.base}/compare`, { params: { ids: ids.join(',') } });
  }

  /** GET /api/trends?id=X — time-series score history for one company */
  getTrends(id: string) {
    return this.http.get<TrendPoint[]>(`${this.base}/trends`, { params: { id } });
  }

  /** GET /api/trends/multi?ids=X,Y,... — histories for multiple companies */
  getMultiTrends(ids: string[]) {
    return this.http.get<CompanyTrend[]>(`${this.base}/trends/multi`, { params: { ids: ids.join(',') } });
  }

  industries() {
    return this.http.get<string[]>(`${this.base}/companies/facets/industries`);
  }

  countries() {
    return this.http.get<string[]>(`${this.base}/companies/facets/countries`);
  }
}
