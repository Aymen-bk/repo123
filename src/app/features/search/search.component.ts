import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CompareService } from '../../core/services/compare.service';
import { ScoreBadgeComponent } from '../../shared/components/score-badge/score-badge.component';
import { ScoreBarComponent } from '../../shared/components/score-bar/score-bar.component';
import { Company } from '../../core/models/company.model';
import { CompanyApiService } from '../../core/services/company-api.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ScoreBadgeComponent, ScoreBarComponent],
  template: `
    <div class="p-7 max-w-[1200px] mx-auto animate-fade-up">

      <div class="mb-7">
        <h1 class="font-syne text-2xl font-extrabold mb-1">Company Search</h1>
        <p class="text-muted text-sm mb-5">Search across ESG-rated companies — filter by sector, country, and score range</p>

        <div class="relative mb-3">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-lg">S</span>
          <input [(ngModel)]="query" (ngModelChange)="runSearch()"
                 type="text" placeholder="Search by company name or ticker…"
                 class="w-full pl-12 pr-4 py-3.5 text-sm bg-card border border-border rounded-xl text-slate-200 outline-none transition-all focus:border-esg-blue-l focus:shadow-[0_0_0_3px_rgba(59,114,246,0.1)] placeholder:text-muted font-dm"/>
        </div>

        <div class="grid grid-cols-4 gap-3 items-end md:grid-cols-2 sm:grid-cols-1">
          <div>
            <label class="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1.5">Sector</label>
            <select [(ngModel)]="industry" (ngModelChange)="runSearch()" class="hk-input w-full">
              <option value="">All Sectors</option>
              <option *ngFor="let i of industries" [value]="i">{{ i }}</option>
            </select>
          </div>
          <div>
            <label class="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1.5">Country</label>
            <select [(ngModel)]="country" (ngModelChange)="runSearch()" class="hk-input w-full">
              <option value="">All Countries</option>
              <option *ngFor="let c of countries" [value]="c">{{ c }}</option>
            </select>
          </div>
          <div>
            <label class="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1.5">Min Score: {{ minScore }}</label>
            <input type="range" [(ngModel)]="minScore" (ngModelChange)="runSearch()" min="0" max="100" step="5"
                   class="w-full h-1.5 rounded-full appearance-none bg-border cursor-pointer accent-esg-blue-l"/>
          </div>
          <div>
            <label class="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1.5">Max Score: {{ maxScore }}</label>
            <input type="range" [(ngModel)]="maxScore" (ngModelChange)="runSearch()" min="0" max="100" step="5"
                   class="w-full h-1.5 rounded-full appearance-none bg-border cursor-pointer accent-esg-blue-l"/>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between mb-4">
        <div class="text-sm text-muted">
          <span class="text-slate-200 font-semibold">{{ results().length }}</span> companies found
        </div>
        <div *ngIf="compareCount() > 0" class="text-xs text-esg-blue-l font-semibold">
          {{ compareCount() }}/4 selected for comparison
        </div>
      </div>

      <div *ngIf="results().length === 0" class="text-center py-20 text-muted">
        <div class="text-5xl mb-4">-</div>
        <p class="text-lg font-semibold">No companies found</p>
        <p class="text-sm mt-1">Try adjusting your filters</p>
      </div>

      <div class="grid grid-cols-3 gap-4 lg:grid-cols-2 md:grid-cols-1">
        <div *ngFor="let company of results()"
             class="bg-card border border-border rounded-xl p-5 cursor-pointer transition-all duration-200 relative overflow-hidden group hover:border-esg-blue/40 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.3)]">

          <div class="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl"
               [style.background]="scoreGradient(company.humankind_response.global_score)"></div>

          <button (click)="toggleCompare($event, company)"
            class="absolute top-3 right-3 px-2.5 py-1 text-[11px] font-bold rounded-md border transition-all z-10"
            [ngClass]="compareBtnClass(company.company_id)">
            {{ isSelected(company.company_id) ? 'Added' : 'Compare' }}
          </button>

          <a [routerLink]="['/company', company.company_id]" class="block no-underline">
            <div class="font-mono text-[11px] text-muted font-semibold mb-1">{{ company.company_ticker }}</div>
            <div class="font-syne text-[15px] font-bold text-slate-100 mb-1 pr-20">{{ company.company_name }}</div>
            <div class="text-[12px] text-muted mb-4 flex items-center gap-1.5">
              <span>{{ flagEmoji(company.head_quarter_iso_2_code) }}</span>
              {{ company.country }} · {{ company.industry }}
            </div>

            <div class="flex items-end gap-2 mb-4">
              <span class="font-mono text-3xl font-semibold" [class]="scoreColor(company.humankind_response.global_score)">
                {{ company.humankind_response.global_score }}
              </span>
              <div class="mb-1.5">
                <app-score-badge [score]="company.humankind_response.global_score"></app-score-badge>
              </div>
            </div>

            <div class="space-y-1.5">
              <div *ngFor="let cat of company.humankind_response.category_details" class="flex items-center gap-2">
                <span class="text-[11px] w-20 text-muted font-medium">{{ cat.category }}</span>
                <app-score-bar [score]="cat.average_score" class="flex-1"></app-score-bar>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  `,
})
export class SearchComponent implements OnInit {
  private api = inject(CompanyApiService);
  private compare  = inject(CompareService);

  query    = '';
  industry = '';
  country  = '';
  minScore = 0;
  maxScore = 100;

  results  = signal<Company[]>([]);
  industries: string[] = [];
  countries:  string[] = [];
  compareCount = this.compare.count;

  ngOnInit(): void {
    void this.init();
  }

  private async init(): Promise<void> {
    this.industries = await firstValueFrom(this.api.industries());
    this.countries = await firstValueFrom(this.api.countries());
    await this.runSearch();
  }

  async runSearch(): Promise<void> {
    const items = await firstValueFrom(
      this.api.searchCompanies({
        q: this.query,
        industry: this.industry,
        country: this.country,
        minScore: this.minScore,
        maxScore: this.maxScore,
      }),
    );

    this.results.set(
      items.map(i => ({
        company_id: i.company_id,
        company_name: i.company_name,
        company_ticker: i.company_ticker,
        country: i.country,
        head_quarter_iso_2_code: i.head_quarter_iso_2_code,
        industry: i.industry,
        company_type: '',
        website: '',
        investor_website: '',
        company_logo: null,
        Source: '',
        status: 'success',
        is_current: true,
        timestamp: new Date().toISOString(),
        humankind_response: {
          global_score: i.global_score ?? 0,
          processing_time: 0,
          category_details: [],
        },
      })) as unknown as Company[],
    );
  }

  toggleCompare(event: Event, company: Company): void {
    event.preventDefault();
    event.stopPropagation();
    this.compare.toggle(company);
  }

  isSelected(id: string): boolean {
    return this.compare.isSelected(id);
  }

  compareBtnClass(companyId: string): { [key: string]: boolean } {
    const sel = this.isSelected(companyId);
    return {
      'bg-esg-blue/30': sel,
      'border-esg-blue': sel,
      'text-white': sel,
      'bg-esg-blue/10': !sel,
      'border-esg-blue/30': !sel,
      'text-esg-blue-l': !sel,
    };
  }

  scoreColor(s: number): string {
    if (s >= 80) return 'text-esg-planet';
    if (s >= 50) return 'text-esg-people';
    return 'text-red-400';
  }

  scoreGradient(s: number): string {
    if (s >= 80) return 'linear-gradient(90deg, #0EA472, transparent)';
    if (s >= 50) return 'linear-gradient(90deg, #F59E0B, transparent)';
    return 'linear-gradient(90deg, #EF4444, transparent)';
  }

  flagEmoji(iso: string): string {
    const flags: Record<string, string> = { US: '🇺🇸', IT: '🇮🇹', GB: '🇬🇧', DE: '🇩🇪', FR: '🇫🇷', JP: '🇯🇵' };
    return flags[iso] || '';
  }
}
