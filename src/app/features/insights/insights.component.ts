import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ScoreBadgeComponent } from '../../shared/components/score-badge/score-badge.component';
import { CompanyApiService } from '../../core/services/company-api.service';
import { Company } from '../../core/models/company.model';

declare const Chart: any;

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [CommonModule, RouterLink, ScoreBadgeComponent],
  template: `
    <div class="p-7 max-w-[1200px] mx-auto animate-fade-up">
      <div class="mb-7">
        <h1 class="font-syne text-2xl font-extrabold mb-1">Insights & Trends</h1>
        <p class="text-muted text-sm">Sector benchmarks, score distribution, and top performers</p>
      </div>

      <div class="grid grid-cols-3 gap-4 mb-6 md:grid-cols-1">
        <div *ngFor="let kpi of kpiCards" class="bg-card border border-border rounded-xl p-5"
             [style.border-color]="kpi.color + '40'">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-3"
               [style.background]="kpi.color + '20'">{{ kpi.icon }}</div>
          <div class="font-mono text-3xl font-semibold mb-1" [style.color]="kpi.color">{{ kpi.value }}</div>
          <div class="text-sm font-semibold text-slate-200 mb-0.5">{{ kpi.label }}</div>
          <div class="text-xs text-muted">{{ kpi.sub }}</div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-5 mb-5 md:grid-cols-1">
        <div class="bg-card border border-border rounded-xl p-5">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="font-syne text-sm font-bold text-slate-200">Score Distribution</h3>
              <p class="text-muted text-xs mt-0.5">Global ESG score histogram across all companies</p>
            </div>
          </div>
          <div class="h-[200px]"><canvas #histCanvas></canvas></div>
        </div>

        <div class="bg-card border border-border rounded-xl p-5">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="font-syne text-sm font-bold text-slate-200">Sector Avg by Category</h3>
              <p class="text-muted text-xs mt-0.5">Average ESG category scores across all companies</p>
            </div>
          </div>
          <div class="h-[200px]"><canvas #sectorCanvas></canvas></div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-5 md:grid-cols-1">
        <div class="bg-card border border-border rounded-xl p-5">
          <h3 class="font-syne text-sm font-bold text-slate-200 mb-4">Top ESG Performers</h3>
          <div class="space-y-3">
            <div *ngFor="let c of topPerformers; let i = index"
                 class="flex items-center gap-3 p-3 bg-white/3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                 [routerLink]="['/company', c.company_id]">
              <div class="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                   [ngClass]="rankBadgeClass(i)">
                {{ i + 1 }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-syne font-bold text-sm truncate">{{ c.company_name }}</div>
                <div class="text-muted text-xs">{{ c.industry }}</div>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div class="h-full bg-esg-planet rounded-full"
                       [style.width.%]="c.humankind_response.global_score"></div>
                </div>
                <app-score-badge [score]="c.humankind_response.global_score"></app-score-badge>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-card border border-border rounded-xl p-5">
          <h3 class="font-syne text-sm font-bold text-slate-200 mb-4">Category Benchmarks by Company</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-[12px]">
              <thead>
                <tr class="border-b border-border">
                  <th class="text-left text-muted py-2 pr-3 font-semibold">Company</th>
                  <th *ngFor="let cat of ['Governance','People','Planet']"
                      class="text-center py-2 px-2 font-semibold" [style.color]="catColor(cat)">
                    {{ catEmoji(cat) }} {{ cat }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let c of allCompanies" class="border-b border-white/4 hover:bg-white/2">
                  <td class="py-2.5 pr-3">
                    <div class="font-semibold text-slate-200">{{ c.company_name }}</div>
                    <div class="text-muted text-[10px]">{{ c.company_ticker }}</div>
                  </td>
                  <td *ngFor="let cat of ['Governance','People','Planet']" class="py-2.5 px-2 text-center">
                    <span class="font-mono font-semibold text-xs" [ngClass]="catScoreClass(c, cat)">
                      {{ getCatScore(c, cat) ?? 'N/A' }}
                    </span>
                  </td>
                </tr>
                <tr class="border-t border-border bg-white/2 font-bold">
                  <td class="py-2.5 pr-3 text-muted text-[11px] font-semibold uppercase tracking-wider">Average</td>
                  <td *ngFor="let cat of ['Governance','People','Planet']" class="py-2.5 px-2 text-center">
                    <span class="font-mono text-xs font-bold text-esg-blue-l">{{ avgCat(cat) }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class InsightsComponent implements OnInit, AfterViewInit {
  @ViewChild('histCanvas')   histCanvas!:   ElementRef<HTMLCanvasElement>;
  @ViewChild('sectorCanvas') sectorCanvas!: ElementRef<HTMLCanvasElement>;

  private api = inject(CompanyApiService);

  allCompanies: Company[] = [];
  topPerformers: Company[] = [];

  kpiCards: Array<{ icon: string; color: string; value: string; label: string; sub: string }> = [];

  ngOnInit(): void {
    void this.load();
  }

  private async load(): Promise<void> {
    const items = await firstValueFrom(this.api.searchCompanies({}));
    const full = await Promise.all(items.slice(0, 50).map(i => firstValueFrom(this.api.getCompany(i.company_id))));
    this.allCompanies = full;
    this.topPerformers = [...this.allCompanies].sort(
      (a, b) => b.humankind_response.global_score - a.humankind_response.global_score,
    );

    this.kpiCards = [
      { icon: 'P', color: '#0EA472', value: this.avg('Planet').toFixed(1), label: 'Avg Planet Score', sub: 'Across all tracked companies' },
      { icon: 'Pe', color: '#F59E0B', value: this.avg('People').toFixed(1), label: 'Avg People Score', sub: 'Workforce, H&S, human rights' },
      { icon: 'G', color: '#8B5CF6', value: this.avg('Governance').toFixed(1), label: 'Avg Governance Score', sub: 'Ethics, data, compliance' },
    ];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.buildHistogram();
      this.buildSectorChart();
    }, 150);
  }

  buildHistogram(): void {
    if (typeof Chart === 'undefined' || !this.histCanvas) return;
    const scores = this.allCompanies.map(c => c.humankind_response.global_score);
    const bins = ['0-20','20-40','40-60','60-80','80-100'];
    const counts = [
      scores.filter(s => s < 20).length,
      scores.filter(s => s >= 20 && s < 40).length,
      scores.filter(s => s >= 40 && s < 60).length,
      scores.filter(s => s >= 60 && s < 80).length,
      scores.filter(s => s >= 80).length,
    ];
    const ctx = this.histCanvas.nativeElement.getContext('2d')!;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: bins,
        datasets: [{ label: 'Companies', data: counts, backgroundColor: ['#EF444460','#F59E0B60','#F59E0B60','#3B72F660','#0EA47260'], borderColor: ['#EF4444','#F59E0B','#F59E0B','#3B72F6','#0EA472'], borderWidth: 1.5, borderRadius: 6 }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#7B91B0', font: { family: 'DM Sans', size: 11 } } },
          y: { min: 0, ticks: { stepSize: 1, color: '#7B91B0', font: { family: 'JetBrains Mono', size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
        },
        plugins: { legend: { display: false } },
      },
    });
  }

  buildSectorChart(): void {
    if (typeof Chart === 'undefined' || !this.sectorCanvas) return;
    const ctx = this.sectorCanvas.nativeElement.getContext('2d')!;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Governance', 'People', 'Planet'],
        datasets: [{
          label: 'Sector Average',
          data: ['Governance','People','Planet'].map(c => parseFloat(this.avg(c).toFixed(1))),
          backgroundColor: ['#8B5CF660','#F59E0B60','#0EA47260'],
          borderColor: ['#8B5CF6','#F59E0B','#0EA472'],
          borderWidth: 1.5, borderRadius: 8,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        indexAxis: 'y' as const,
        scales: {
          x: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#7B91B0', font: { family: 'JetBrains Mono', size: 10 } } },
          y: { grid: { display: false }, ticks: { color: '#E2E8F0', font: { family: 'DM Sans', weight: '600' } } },
        },
        plugins: { legend: { display: false } },
      },
    });
  }

  avg(catName: string): number {
    const scores = this.allCompanies
      .map(c => c.humankind_response.category_details.find(cat => cat.category === catName)?.average_score)
      .filter((s): s is number => s !== undefined);
    return scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  }

  avgCat(cat: string): string {
    return this.avg(cat).toFixed(1);
  }

  getCatScore(c: any, catName: string): number | null {
    return c.humankind_response.category_details.find((cat: any) => cat.category === catName)?.average_score ?? null;
  }

  catColor(cat: string): string {
    return { Governance: '#8B5CF6', People: '#F59E0B', Planet: '#0EA472' }[cat] ?? '#3B72F6';
  }

  catEmoji(cat: string): string {
    return { Governance: 'Gov', People: 'Ppl', Planet: 'Pln' }[cat] ?? 'Cat';
  }

  catScoreClass(c: any, cat: string): { [key: string]: boolean } {
    const s = this.getCatScore(c, cat);
    if (s == null) return {};
    return {
      'text-esg-planet': s >= 80,
      'text-esg-people': s >= 50 && s < 80,
      'text-red-400': s < 50,
    };
  }

  rankBadgeClass(index: number): { [key: string]: boolean } {
    return {
      'bg-amber-400/20': index === 0,
      'text-amber-400': index === 0,
      'bg-slate-400/20': index === 1,
      'text-slate-300': index === 1,
      'bg-orange-600/20': index === 2,
      'text-orange-400': index === 2,
    };
  }
}
