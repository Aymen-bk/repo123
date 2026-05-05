import { Injectable, signal, computed } from '@angular/core';
import { Company } from '../models/company.model';

@Injectable({ providedIn: 'root' })
export class CompareService {
  private _selected = signal<Company[]>([]);

  readonly selected   = this._selected.asReadonly();
  readonly count      = computed(() => this._selected().length);
  readonly canCompare = computed(() => this._selected().length >= 2);

  add(company: Company): void {
    if (this._selected().length < 4 && !this.isSelected(company.company_id)) {
      this._selected.update(prev => [...prev, company]);
    }
  }

  remove(id: string): void {
    this._selected.update(prev => prev.filter(c => c.company_id !== id));
  }

  toggle(company: Company): void {
    this.isSelected(company.company_id) ? this.remove(company.company_id) : this.add(company);
  }

  clear(): void {
    this._selected.set([]);
  }

  isSelected(id: string): boolean {
    return this._selected().some(c => c.company_id === id);
  }
}
