import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CompanyApiService } from '../../core/services/company-api.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-manual-entry',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="p-7 max-w-[860px] mx-auto animate-fade-up">
      <div class="mb-6">
        <a routerLink="/import" class="text-muted text-sm hover:text-slate-300 transition-colors">← Back to Import</a>
        <h1 class="font-syne text-2xl font-extrabold mt-2 mb-1">Manual Company Entry</h1>
        <p class="text-muted text-sm">Add a single company with its core ESG metrics. Scores will be auto-computed.</p>
      </div>

      <form (ngSubmit)="submit()" #form="ngForm">
        <div class="bg-card border border-border rounded-xl p-6 mb-4">
          <h3 class="font-syne text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider">Company Identity</h3>
          <div class="grid grid-cols-2 gap-4 md:grid-cols-1">
            <div>
              <label class="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Company ID *</label>
              <input [(ngModel)]="form_.company_id" name="company_id" required class="hk-input w-full" placeholder="AAPL" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Company Name *</label>
              <input [(ngModel)]="form_.company_name" name="company_name" required class="hk-input w-full" placeholder="Apple Inc." />
            </div>
            <div>
              <label class="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Ticker</label>
              <input [(ngModel)]="form_.company_ticker" name="company_ticker" class="hk-input w-full" placeholder="AAPL" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Country</label>
              <input [(ngModel)]="form_.country" name="country" class="hk-input w-full" placeholder="United States" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Industry</label>
              <input [(ngModel)]="form_.industry" name="industry" class="hk-input w-full" placeholder="Technology" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Website</label>
              <input [(ngModel)]="form_.website" name="website" class="hk-input w-full" placeholder="https://apple.com" />
            </div>
          </div>
        </div>

        <!-- ESG Scores (L1) — auto-calculated from L3 if 0, but user can override -->
        <div class="bg-card border border-border rounded-xl p-6 mb-4">
          <h3 class="font-syne text-sm font-bold text-slate-300 mb-1 uppercase tracking-wider">ESG Category Scores</h3>
          <p class="text-muted text-xs mb-4">Optional — leave at 0 to have scores auto-computed from L3 metrics below.</p>
          <div class="grid grid-cols-3 gap-4 md:grid-cols-1">
            <div *ngFor="let cat of categories">
              <label class="block text-xs font-semibold mb-1.5" [style.color]="catColor(cat.key)">{{ cat.label }} Score (0–100)</label>
              <input [(ngModel)]="catScores[cat.key]" [name]="cat.key + '_score'" type="number" min="0" max="100"
                     class="hk-input w-full" placeholder="0" />
            </div>
          </div>
        </div>

        <div class="bg-card border border-border rounded-xl p-6 mb-6">
          <h3 class="font-syne text-sm font-bold text-slate-300 mb-1 uppercase tracking-wider">L3 Key Metrics (Optional)</h3>
          <p class="text-muted text-xs mb-4">Enter known metric scores (0–100). Used for auto-scoring when category scores are 0.</p>
          <div *ngFor="let cat of categories" class="mb-5">
            <div class="text-xs font-bold uppercase tracking-wider mb-2" [style.color]="catColor(cat.key)">{{ cat.label }}</div>
            <div class="grid grid-cols-2 gap-3 md:grid-cols-1">
              <div *ngFor="let m of cat.metrics; let i = index">
                <label class="block text-xs text-muted mb-1">{{ m }}</label>
                <input [(ngModel)]="l3Scores[cat.key][i]" [name]="cat.key + '_m' + i" type="number" min="0" max="100"
                       class="hk-input w-full text-sm" placeholder="—" />
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="error()" class="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3 mb-4">
          {{ error() }}
        </div>
        <div *ngIf="success()" class="text-green-400 text-sm bg-green-400/10 border border-green-400/20 rounded-xl px-4 py-3 mb-4">
          ✓ Company saved! <a [routerLink]="['/company', savedId()]" class="underline">View profile</a>
        </div>

        <div class="flex gap-3">
          <button type="submit" [disabled]="submitting()" class="hk-btn-primary px-8 py-3 disabled:opacity-40">
            {{ submitting() ? 'Saving...' : 'Save Company' }}
          </button>
          <button type="button" (click)="reset()" class="hk-btn-ghost px-6 py-3">Reset</button>
        </div>
      </form>
    </div>
  `,
})
export class ManualEntryComponent {
  private api    = inject(CompanyApiService);
  private router = inject(Router);

  submitting = signal(false);
  error      = signal('');
  success    = signal(false);
  savedId    = signal('');

  categories = [
    { key: 'Governance', label: 'Governance', metrics: ['Ethics & Compliance', 'Board Independence', 'Data Privacy', 'Transparency'] },
    { key: 'People',     label: 'People',     metrics: ['Employee Safety', 'Diversity & Inclusion', 'Labour Practices', 'Community Impact'] },
    { key: 'Planet',     label: 'Planet',     metrics: ['GHG Emissions', 'Water Usage', 'Waste Management', 'Renewable Energy'] },
  ];

  catScores: Record<string, number> = { Governance: 0, People: 0, Planet: 0 };
  l3Scores:  Record<string, number[]> = {
    Governance: [0, 0, 0, 0],
    People:     [0, 0, 0, 0],
    Planet:     [0, 0, 0, 0],
  };

  form_ = {
    company_id: '', company_name: '', company_ticker: '',
    country: '', industry: '', website: '',
  };

  catColor(cat: string): string {
    return { Governance: '#8B5CF6', People: '#F59E0B', Planet: '#0EA472' }[cat] ?? '#3B72F6';
  }

  reset(): void {
    this.form_ = { company_id: '', company_name: '', company_ticker: '', country: '', industry: '', website: '' };
    this.catScores = { Governance: 0, People: 0, Planet: 0 };
    this.l3Scores = { Governance: [0,0,0,0], People: [0,0,0,0], Planet: [0,0,0,0] };
    this.error.set('');
    this.success.set(false);
  }

  async submit(): Promise<void> {
    if (!this.form_.company_id || !this.form_.company_name) {
      this.error.set('Company ID and Name are required.');
      return;
    }
    this.submitting.set(true);
    this.error.set('');

    const categoryDetails = this.categories.map(cat => ({
      category: cat.key,
      average_score: this.catScores[cat.key] || 0,
      level_2_metrics: cat.metrics.map((m, i) => ({
        metric_name: m,
        average_score: this.l3Scores[cat.key][i] || 0,
        level_3_metrics: [{
          metric_name: m,
          score: this.l3Scores[cat.key][i] || null,
          sources: [], user_friendly_explanation: [], information: [],
          score_explanation_english: [], score_explanation_french: [],
        }],
      })),
    }));

    const payload = {
      ...this.form_,
      head_quarter_iso_2_code: '',
      company_type: 'Public',
      investor_website: '',
      company_logo: null,
      Source: 'manual',
      status: 'active',
      is_current: true,
      timestamp: new Date().toISOString(),
      humankind_response: {
        global_score: 0,
        processing_time: 0,
        category_details: categoryDetails,
      },
    };

    try {
      const res = await firstValueFrom(this.api.createCompany(payload));
      this.savedId.set(res.id);
      this.success.set(true);
    } catch (err: any) {
      this.error.set(err?.error?.message ?? 'Failed to save company. Please try again.');
    } finally {
      this.submitting.set(false);
    }
  }
}
