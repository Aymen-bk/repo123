import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-score-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-2">
      <div class="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div class="h-full rounded-full transition-all duration-700"
             [style.width.%]="score ?? 0"
             [class]="fillClass"></div>
      </div>
      <span class="font-mono text-xs font-semibold w-8 text-right" [class]="textClass">
        {{ score === null ? 'N/A' : score }}
      </span>
    </div>
  `,
})
export class ScoreBarComponent {
  @Input() score: number | null = null;

  get fillClass(): string {
    if (this.score === null) return 'bg-muted';
    if (this.score >= 80)   return 'bg-esg-planet';
    if (this.score >= 50)   return 'bg-esg-people';
    return 'bg-red-400';
  }

  get textClass(): string {
    if (this.score === null) return 'text-muted';
    if (this.score >= 80)   return 'text-esg-planet';
    if (this.score >= 50)   return 'text-esg-people';
    return 'text-red-400';
  }
}
