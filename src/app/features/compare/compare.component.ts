import { Component, inject, signal, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CompareService } from '../../core/services/compare.service';
import { ScoreBadgeComponent } from '../../shared/components/score-badge/score-badge.component';
import { Company } from '../../core/models/company.model';
import { CompanyApiService, CompanyListItem } from '../../core/services/company-api.service';

declare const Chart: any;

type CompareTab = 'overview' | 'subcriteria' | 'level3';

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [CommonModule, RouterLink, ScoreBadgeComponent],
  template: `
    <div class="p-7 max-w-[1200px] mx-auto animate-fade-up">
      <div class="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 class="font-syne text-2xl font-extrabold mb-1">Company Comparison</h1>
          <p class="text-muted text-sm">Side-by-side ESG analysis across all levels</p>
        </div>
        <button *ngIf="selected().length > 0" (click)="clearAll()" class="hk-btn-ghost text-xs">
          Clear All
        </button>
      </div>

      <div class="grid grid-cols-4 gap-3 mb-7 md:grid-cols-2">
        <div *ngFor="let company of selected(); let i = index"
             class="bg-esg-blue/10 border border-esg-blue/40 rounded-xl p-3 flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-esg-blue/30 flex items-center justify-center font-syne font-bold text-esg-blue-l text-sm shrink-0">
            {{ company.company_name[0] }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="font-syne text-sm font-bold truncate">{{ company.company_name }}</div>
            <div class="font-mono text-[10px] text-muted">{{ company.company_ticker }}</div>
          </div>
          <button (click)="remove(company.company_id)"
            class="text-muted hover:text-red-400 transition-colors text-xs bg-transparent border-none cursor-pointer shrink-0">x</button>
        </div>

        <div *ngFor="let slot of emptySlots" (click)="addCompany()"
             class="border border-dashed border-border rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer hover:border-white/30 transition-colors text-muted text-sm">
          <span>+</span> Add Company
        </div>
      </div>

      <div *ngIf="showAddDropdown()" class="bg-card2 border border-border rounded-xl p-4 mb-5">
        <div class="text-sm font-semibold mb-3 text-slate-300">Select a company to add:</div>
        <div class="flex flex-wrap gap-2">
          <button *ngFor="let c of availableToAdd()" (click)="addToCompare(c)"
            class="hk-btn-ghost text-xs flex items-center gap-1.5">
            {{ c.company_name }} <span class="text-muted">({{ c.company_ticker }})</span>
          </button>
          <button (click)="showAddDropdown.set(false)" class="text-muted text-xs px-2">Cancel</button>
        </div>
      </div>

      <div *ngIf="selected().length < 2" class="text-center py-20 text-muted">
        <div class="text-5xl mb-4">-</div>
        <p class="text-lg font-semibold">Select at least 2 companies</p>
        <p class="text-sm mt-1">Go to <a routerLink="/search" class="text-esg-blue-l">Search</a> and add companies using the "+ Compare" button</p>
      </div>

      <div *ngIf="selected().length >= 2">

        <div class="flex gap-1 bg-white/4 rounded-xl p-1 w-fit mb-6">
          <button *ngFor="let tab of tabs" (click)="activeTab.set(tab.id)"
            class="px-4 py-2 rounded-lg text-[13px] font-medium transition-all cursor-pointer border-none"
            [class.bg-card]="activeTab() === tab.id"
            [class.text-white]="activeTab() === tab.id"
            [class.font-semibold]="activeTab() === tab.id"
            [class.shadow-lg]="activeTab() === tab.id"
            [class.text-muted]="activeTab() !== tab.id"
            style="font-family: 'DM Sans', sans-serif;">
            {{ tab.label }}
          </button>
        </div>

        <div *ngIf="activeTab() === 'overview'">
          <div class="bg-card border border-border rounded-xl p-5 mb-5">
            <h3 class="font-syne text-sm font-bold mb-4 text-slate-300 uppercase tracking-wider">L1 — Global Scores</h3>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-border">
                    <th class="text-left text-[11px] font-bold uppercase tracking-wider text-muted py-3 px-4">Metric</th>
                    <th *ngFor="let c of selected()" class="text-center py-3 px-4">
                      <div class="font-syne font-bold text-sm text-slate-200">{{ c.company_name }}</div>
                      <div class="font-mono text-[10px] text-muted">{{ c.company_ticker }}</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-b border-white/4 hover:bg-white/2">
                    <td class="py-3 px-4 text-sm text-slate-300 font-medium">Global ESG Score</td>
                    <td *ngFor="let c of selected()" class="py-3 px-4 text-center">
                      <span class="font-mono text-2xl font-semibold" [class]="scoreColorClass(c.humankind_response.global_score)">
                        {{ c.humankind_response.global_score }}
                      </span>
                    </td>
                  </tr>
                  <tr *ngFor="let cat of categoryNames" class="border-b border-white/4 hover:bg-white/2">
                    <td class="py-3 px-4 text-sm flex items-center gap-2">
                      <span>{{ catEmoji(cat) }}</span>
                      <span [style.color]="catColor(cat)" class="font-medium">{{ cat }}</span>
                    </td>
                    <td *ngFor="let c of selected()" class="py-3 px-4">
                      <div class="flex flex-col items-center gap-1">
                        <app-score-badge [score]="getCatScore(c, cat)"></app-score-badge>
                        <div class="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div class="h-full rounded-full" [style.width.%]="getCatScore(c, cat) ?? 0" [style.background]="catColor(cat)"></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="bg-card border border-border rounded-xl p-5">
            <h3 class="font-syne text-sm font-bold mb-4 text-slate-300 uppercase tracking-wider">Category Score Comparison</h3>
            <div class="h-[280px]"><canvas #barCanvas></canvas></div>
          </div>
        </div>

        <div *ngIf="activeTab() === 'subcriteria'">
          <div class="bg-card border border-border rounded-xl overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="bg-card2 border-b border-border">
                    <th class="text-left text-[11px] font-bold uppercase tracking-wider text-muted py-3 px-4 w-56">L2 Sub-Criterion</th>
                    <th *ngFor="let c of selected()" class="text-center py-3 px-4">
                      <div class="font-syne font-bold text-sm text-slate-200">{{ c.company_ticker }}</div>
                    </th>
                    <th class="text-center text-[11px] font-bold uppercase tracking-wider text-muted py-3 px-4">Gap</th>
                  </tr>
                </thead>
                <tbody>
                  <ng-container *ngFor="let cat of selected()[0].humankind_response.category_details">
                    <tr class="bg-white/2 border-b border-border">
                      <td [colSpan]="selected().length + 2" class="py-2 px-4">
                        <span class="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" [style.color]="catColor(cat.category)">
                          {{ catEmoji(cat.category) }} {{ cat.category }}
                        </span>
                      </td>
                    </tr>
                    <tr *ngFor="let m2 of cat.level_2_metrics" class="border-b border-white/4 hover:bg-white/2 transition-colors">
                      <td class="py-2.5 px-4 text-[13px] text-slate-300">{{ m2.metric_name }}</td>
                      <td *ngFor="let c of selected()" class="py-2.5 px-4">
                        <div class="flex flex-col items-center gap-1">
                          <app-score-badge [score]="getL2Score(c, cat.category, m2.metric_name)"></app-score-badge>
                        </div>
                      </td>
                      <td class="py-2.5 px-4 text-center">
                        <span *ngIf="getGap(cat.category, m2.metric_name) as gap" class="font-mono text-[11px] font-bold px-2 py-0.5 rounded-lg"
                          [ngClass]="gapClass(gap)">
                          {{ gap | number:'1.0-0' }}
                        </span>
                      </td>
                    </tr>
                  </ng-container>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div *ngIf="activeTab() === 'level3'">
          <div class="bg-card border border-border rounded-xl overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="bg-card2 border-b border-border">
                    <th class="text-left text-[11px] font-bold uppercase tracking-wider text-muted py-3 px-4 w-64">L3 Metric</th>
                    <th *ngFor="let c of selected()" class="text-center py-3 px-4">
                      <div class="font-syne font-bold text-sm text-slate-200">{{ c.company_ticker }}</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <ng-container *ngFor="let cat of selected()[0].humankind_response.category_details">
                    <tr class="bg-white/2 border-b border-border">
                      <td [colSpan]="selected().length + 1" class="py-2 px-4">
                        <span class="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" [style.color]="catColor(cat.category)">
                          {{ catEmoji(cat.category) }} {{ cat.category }}
                        </span>
                      </td>
                    </tr>
                    <ng-container *ngFor="let m2 of cat.level_2_metrics">
                      <tr class="border-b border-white/4 bg-white/1">
                        <td [colSpan]="selected().length + 1" class="py-1.5 px-4 text-[11px] text-muted italic">{{ m2.metric_name }}</td>
                      </tr>
                      <tr *ngFor="let m3 of m2.level_3_metrics" class="border-b border-white/4 hover:bg-white/2 transition-colors">
                        <td class="py-2.5 px-4 pl-7 text-[12px] text-slate-300">{{ m3.metric_name }}</td>
                        <td *ngFor="let c of selected()" class="py-2.5 px-4 text-center">
                          <app-score-badge [score]="getL3Score(c, cat.category, m2.metric_name, m3.metric_name)"></app-score-badge>
                        </td>
                      </tr>
                    </ng-container>
                  </ng-container>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CompareComponent implements OnInit, AfterViewInit {
  @ViewChild('barCanvas') barCanvas!: ElementRef<HTMLCanvasElement>;

  private compareService = inject(CompareService);
  private api            = inject(CompanyApiService);

  selected     = this.compareService.selected;
  activeTab    = signal<CompareTab>('overview');
  showAddDropdown = signal(false);
  categoryNames = ['Governance', 'People', 'Planet'];
  private barChart: any;
  private allAvailable = signal<CompanyListItem[]>([]);

  tabs = [
    { id: 'overview'    as CompareTab, label: 'L1 Overview'   },
    { id: 'subcriteria' as CompareTab, label: 'Sub-Criteria'  },
    { id: 'level3'      as CompareTab, label: 'L3 Details'    },
  ];

  get emptySlots(): number[] {
    return Array(Math.max(0, 4 - this.selected().length)).fill(0);
  }

  availableToAdd() {
    const ids = new Set(this.selected().map(c => c.company_id));
    return this.allAvailable().filter(c => !ids.has(c.company_id));
  }

  ngOnInit(): void {
    void this.loadAvailable();
  }

  private async loadAvailable(): Promise<void> {
    const items = await firstValueFrom(this.api.searchCompanies({}));
    this.allAvailable.set(items);
  }

  ngAfterViewInit(): void {
    if (this.selected().length >= 2) setTimeout(() => this.buildBarChart(), 200);
  }

  buildBarChart(): void {
    if (typeof Chart === 'undefined' || !this.barCanvas) return;
    if (this.barChart) this.barChart.destroy();
    const companies = this.selected();
    const ctx = this.barCanvas.nativeElement.getContext('2d')!;
    const colors = ['#3B72F6', '#0EA472', '#F59E0B', '#8B5CF6'];
    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.categoryNames,
        datasets: companies.map((c, i) => ({
          label: c.company_name,
          data: this.categoryNames.map(cat => this.getCatScore(c, cat) ?? 0),
          backgroundColor: colors[i] + '80',
          borderColor: colors[i],
          borderWidth: 1.5,
          borderRadius: 6,
        })),
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#7B91B0', font: { family: 'DM Sans' } } },
          y: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#7B91B0', font: { family: 'JetBrains Mono', size: 10 } } },
        },
        plugins: { legend: { labels: { color: '#E2E8F0', font: { family: 'DM Sans', size: 12 } } } },
      },
    });
  }

  remove(id: string): void { this.compareService.remove(id); }
  clearAll(): void { this.compareService.clear(); }
  addCompany(): void { this.showAddDropdown.set(true); }
  async addToCompare(c: CompanyListItem): Promise<void> {
    const full = await firstValueFrom(this.api.getCompany(c.company_id));
    this.compareService.add(full);
    this.showAddDropdown.set(false);
  }

  getCatScore(c: Company, catName: string): number | null {
    return c.humankind_response.category_details.find(cat => cat.category === catName)?.average_score ?? null;
  }

  getL2Score(c: Company, catName: string, m2Name: string): number | null {
    const cat = c.humankind_response.category_details.find(cat => cat.category === catName);
    return cat?.level_2_metrics.find(m => m.metric_name === m2Name)?.average_score ?? null;
  }

  getL3Score(c: Company, catName: string, m2Name: string, m3Name: string): number | null {
    const cat = c.humankind_response.category_details.find(cat => cat.category === catName);
    const m2  = cat?.level_2_metrics.find(m => m.metric_name === m2Name);
    return m2?.level_3_metrics.find(m => m.metric_name === m3Name)?.score ?? null;
  }

  getGap(catName: string, m2Name: string): number {
    const companies = this.selected();
    if (companies.length < 2) return 0;
    const scores = companies.map(c => this.getL2Score(c, catName, m2Name)).filter(s => s !== null) as number[];
    if (scores.length < 2) return 0;
    return Math.abs(scores[0] - scores[1]);
  }

  gapClass(gap: number): { [key: string]: boolean } {
    return {
      'bg-red-400/15': gap >= 20,
      'text-red-400': gap >= 20,
      'bg-amber-400/15': gap >= 10 && gap < 20,
      'text-amber-400': gap >= 10 && gap < 20,
      'text-muted': gap < 10,
      'bg-white/5': gap < 10,
    };
  }

  scoreColorClass(s: number): string {
    if (s >= 80) return 'text-esg-planet';
    if (s >= 50) return 'text-esg-people';
    return 'text-red-400';
  }

  catColor(cat: string): string {
    return { Governance: '#8B5CF6', People: '#F59E0B', Planet: '#0EA472' }[cat] ?? '#3B72F6';
  }

  catEmoji(cat: string): string {
    return { Governance: 'Gov', People: 'Ppl', Planet: 'Pln' }[cat] ?? 'Cat';
  }
}
