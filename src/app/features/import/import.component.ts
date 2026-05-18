import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CompanyApiService } from '../../core/services/company-api.service';

@Component({
  selector: 'app-import',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="p-7 max-w-[900px] mx-auto">
      <h1 class="font-syne text-4xl font-extrabold mb-3">Import companies</h1>
      <p class="text-muted text-sm mb-6">
        Upload a JSON file (e.g. from <code class="text-slate-200">pa_instru/</code>) to index it into Elasticsearch.
      </p>

      <div class="bg-card border border-border rounded-xl p-5 space-y-4">
        <input type="file" accept=".json,application/json" (change)="onFile($event)" />

        <button class="hk-btn-primary px-4 py-2" [disabled]="!file() || busy()" (click)="upload()">
          {{ busy() ? 'Uploading…' : 'Upload' }}
        </button>

        <div *ngIf="msg()" class="text-sm text-slate-200 bg-white/5 border border-border rounded-lg p-3">
          {{ msg() }}
        </div>

        <div class="flex items-center gap-3 my-2 text-muted text-xs">
          <div class="flex-1 h-px bg-border"></div> or <div class="flex-1 h-px bg-border"></div>
        </div>

        <a routerLink="/import/manual"
           class="flex items-center gap-3 p-4 bg-white/3 border border-dashed border-border rounded-xl hover:bg-white/5 hover:border-white/30 transition-all">
          <div class="w-9 h-9 rounded-xl bg-esg-blue/20 flex items-center justify-center text-esg-blue-l font-bold text-lg">+</div>
          <div>
            <div class="font-syne font-bold text-sm text-slate-200">Manual Entry</div>
            <div class="text-muted text-xs mt-0.5">Add a single company by filling in its metrics manually</div>
          </div>
        </a>

        <a routerLink="/search" class="text-esg-blue-l text-sm inline-block">Go to Search →</a>
      </div>
    </div>
  `,
})
export class ImportComponent {
  private api = inject(CompanyApiService);

  file = signal<File | null>(null);
  busy = signal(false);
  msg = signal('');

  onFile(e: Event): void {
    const input = e.target as HTMLInputElement;
    this.msg.set('');
    this.file.set(input.files?.[0] ?? null);
  }

  async upload(): Promise<void> {
    const f = this.file();
    if (!f) return;
    this.busy.set(true);
    this.msg.set('');
    try {
      const res = await firstValueFrom(this.api.importCompanies(f));
      this.msg.set(`Imported ${res.importedCount} company document(s). IDs: ${res.ids.join(', ')}`);
    } catch (e: any) {
      this.msg.set(`Import failed. Make sure backend + Elasticsearch are running. ${e?.message ?? ''}`);
    } finally {
      this.busy.set(false);
    }
  }
}

