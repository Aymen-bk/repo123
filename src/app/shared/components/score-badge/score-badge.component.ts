import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-score-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="badgeClass" class="inline-flex items-center justify-center rounded-lg font-mono font-semibold text-xs px-2.5 py-0.5 border">
      {{ score === null ? 'N/A' : score }}
    </span>
  `,
})
export class ScoreBadgeComponent {
  @Input() score: number | null = null;

  get badgeClass(): string {
    if (this.score === null) return 'text-muted border-muted/30 bg-muted/10';
    if (this.score >= 80) return 'text-esg-planet border-esg-planet/30 bg-esg-planet/10';
    if (this.score >= 50) return 'text-esg-people  border-esg-people/30  bg-esg-people/10';
    return 'text-red-400 border-red-400/30 bg-red-400/10';
  }
}
