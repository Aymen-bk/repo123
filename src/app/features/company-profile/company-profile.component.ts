import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CompareService } from '../../core/services/compare.service';
import { ScoreBadgeComponent } from '../../shared/components/score-badge/score-badge.component';
import { ScoreBarComponent } from '../../shared/components/score-bar/score-bar.component';
import { Company, CategoryDetail, Level2Metric } from '../../core/models/company.model';
import { CompanyApiService } from '../../core/services/company-api.service';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, ScoreBadgeComponent, ScoreBarComponent],
  template: `
    <div *ngIf="company" class="p-7 max-w-[1100px] mx-auto animate-fade-up">

      <div class="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <a routerLink="/search" class="text-muted hover:text-slate-300 text-sm no-underline">← Search</a>
          </div>
          <div class="flex items-center gap-3 mb-2">
            <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-esg-blue/30 to-esg-blue/10 border border-esg-blue/20 flex items-center justify-center font-syne font-bold text-esg-blue-l text-lg">
              {{ company.company_name[0] }}
            </div>
            <div>
              <h1 class="font-syne text-2xl font-extrabold leading-none">{{ company.company_name }}</h1>
              <div class="flex items-center gap-2 mt-1.5 flex-wrap">
                <span class="font-mono text-xs font-semibold bg-white/5 border border-border rounded px-2 py-0.5 text-slate-300">{{ company.company_ticker }}</span>
                <span class="text-muted text-xs">{{ flagEmoji(company.head_quarter_iso_2_code) }} {{ company.country }}</span>
                <span class="text-muted text-xs">·</span>
                <span class="text-muted text-xs">{{ company.industry }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="text-right">
            <div class="font-mono text-4xl font-semibold" [class]="scoreColor(company.humankind_response.global_score)">
              {{ company.humankind_response.global_score }}
            </div>
            <div class="text-muted text-xs mt-0.5">Global ESG Score</div>
          </div>
          <div class="flex flex-col gap-2">
            <button (click)="toggleCompare()" class="hk-btn-ghost text-xs flex items-center gap-1.5"
              [ngClass]="compareBtnClass()">
              {{ isSelected ? 'In Compare' : 'Add to Compare' }}
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-[1fr_320px] gap-5 mb-5 lg:grid-cols-1">
        <div class="flex flex-col gap-3">
          <div *ngFor="let cat of company.humankind_response.category_details"
               class="rounded-xl border p-4 transition-all"
               [style.border-color]="catColor(cat.category) + '40'"
               [style.background]="catColor(cat.category) + '0D'">
            <div class="flex items-center justify-between mb-2.5">
              <div class="flex items-center gap-2">
                <span class="text-base">{{ catEmoji(cat.category) }}</span>
                <span class="font-syne text-sm font-bold" [style.color]="catColor(cat.category)">{{ cat.category }}</span>
              </div>
              <span class="font-mono text-xl font-semibold" [style.color]="catColor(cat.category)">{{ cat.average_score }}</span>
            </div>
            <div class="w-full h-1.5 rounded-full bg-white/5">
              <div class="h-full rounded-full transition-all duration-700"
                   [style.width.%]="cat.average_score"
                   [style.background]="catColor(cat.category)"></div>
            </div>
            <div class="text-[11px] text-muted mt-1.5">{{ cat.level_2_metrics.length }} sub-criteria</div>
          </div>

          <div class="bg-card2 border border-border rounded-xl p-3 text-[11px] text-muted">
            <div>Source: <span class="text-slate-300">{{ company.Source }}</span></div>
            <div class="mt-0.5">Updated: <span class="text-slate-300">{{ company.timestamp | date:'mediumDate' }}</span></div>
          </div>
        </div>
      </div>

      <div>
        <h3 class="font-syne text-base font-bold mb-4">Detailed ESG Metrics</h3>

        <div *ngFor="let cat of company.humankind_response.category_details" class="mb-4">
          <button (click)="toggleCat(cat.category)"
            class="w-full flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all text-left"
            [style.border-color]="catColor(cat.category) + '40'"
            [style.background]="openCats.has(cat.category) ? catColor(cat.category) + '15' : catColor(cat.category) + '08'"
            style="font-family: inherit;">
            <span class="text-lg">{{ catEmoji(cat.category) }}</span>
            <span class="font-syne font-bold text-sm flex-1" [style.color]="catColor(cat.category)">{{ cat.category }}</span>
            <app-score-badge [score]="cat.average_score"></app-score-badge>
            <span class="text-muted text-sm transition-transform duration-200"
                  [style.transform]="openCats.has(cat.category) ? 'rotate(90deg)' : ''">▶</span>
          </button>

          <div *ngIf="openCats.has(cat.category)" class="mt-2 space-y-2 pl-3">
            <div *ngFor="let m2 of cat.level_2_metrics"
                 class="bg-card2 border border-border rounded-xl overflow-hidden">

              <button (click)="toggleL2(m2.metric_name)"
                class="w-full flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/3 transition-colors text-left"
                style="background:transparent; font-family:inherit; border:none;">
                <span class="flex-1 text-sm font-medium text-slate-200">{{ m2.metric_name }}</span>
                <app-score-bar [score]="m2.average_score" class="w-32"></app-score-bar>
                <app-score-badge [score]="m2.average_score"></app-score-badge>
                <span class="text-muted text-xs transition-transform duration-200 ml-1"
                      [style.transform]="openL2.has(m2.metric_name) ? 'rotate(90deg)' : ''">▶</span>
              </button>

              <div *ngIf="openL2.has(m2.metric_name)" class="px-4 pb-4 border-t border-border pt-3">
                <div *ngFor="let m3 of m2.level_3_metrics"
                     class="bg-white/2 rounded-lg p-3 mb-2 last:mb-0">
                  <div class="flex items-start justify-between gap-3 mb-2">
                    <span class="text-[13px] font-medium text-slate-200 flex-1">{{ m3.metric_name }}</span>
                    <app-score-badge [score]="m3.score"></app-score-badge>
                  </div>
                  <app-score-bar [score]="m3.score" class="mb-2.5 block"></app-score-bar>

                  <div *ngIf="m3.user_friendly_explanation?.length" class="text-xs text-muted leading-relaxed">
                    {{ m3.user_friendly_explanation[0] }}
                  </div>

                  <div *ngIf="m3.sources?.length" class="mt-2 flex flex-wrap gap-1.5">
                    <a *ngFor="let src of m3.sources.slice(0,3)"
                       [href]="src" target="_blank"
                       class="text-[10px] text-esg-blue-l bg-esg-blue/10 border border-esg-blue/20 rounded px-2 py-0.5 no-underline hover:bg-esg-blue/20 transition-colors">
                       Source
                    </a>
                    <span *ngIf="m3.sources.length > 3" class="text-[10px] text-muted px-2 py-0.5">
                      +{{ m3.sources.length - 3 }} more
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div *ngIf="!company" class="p-7 text-center text-muted">
      <div class="text-5xl mb-4">-</div>
      <p>Company not found.</p>
      <a routerLink="/search" class="text-esg-blue-l text-sm mt-2 inline-block">← Back to Search</a>
    </div>
  `,
})
export class CompanyProfileComponent implements OnInit {

  private route    = inject(ActivatedRoute);
  private api      = inject(CompanyApiService);
  private compare  = inject(CompareService);

  company: Company | undefined;
  openCats = new Set<string>();
  openL2   = new Set<string>();
  isSelected = false;

  ngOnInit(): void {
    void this.load();
  }

  private async load(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id')!;
    try {
      this.company = await firstValueFrom(this.api.getCompany(id));
      this.isSelected = this.compare.isSelected(this.company.company_id);
    } catch {
      this.company = undefined;
    }
  }

  toggleCat(name: string): void {
    this.openCats.has(name) ? this.openCats.delete(name) : this.openCats.add(name);
  }

  toggleL2(name: string): void {
    this.openL2.has(name) ? this.openL2.delete(name) : this.openL2.add(name);
  }

  toggleCompare(): void {
    if (!this.company) return;
    this.compare.toggle(this.company);
    this.isSelected = this.compare.isSelected(this.company.company_id);
  }

  compareBtnClass(): { [key: string]: boolean } {
    return {
      'bg-esg-blue/20': this.isSelected,
      'border-esg-blue/40': this.isSelected,
      'text-esg-blue-l': this.isSelected,
    };
  }

  scoreColor(s: number): string {
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

  flagEmoji(iso: string): string {
    const flags: Record<string, string> = { US: 'US', IT: 'IT', GB: 'GB', DE: 'DE', FR: 'FR', JP: 'JP' };
    return flags[iso] || '';
  }
}
