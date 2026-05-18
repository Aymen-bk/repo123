import { Component, inject, computed } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { CompareService } from '../../../core/services/compare.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="sticky top-0 z-50 flex items-center justify-between h-[60px] px-6 border-b border-border bg-navy/95 backdrop-blur-md">
      <div class="flex items-center gap-2.5 cursor-pointer" routerLink="/search">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-esg-blue to-esg-blue-l flex items-center justify-center text-sm font-bold text-white">HK</div>
        <span class="font-syne text-[17px] font-extrabold tracking-tight">Human<span class="text-esg-blue-l">Kind</span>-360</span>
      </div>

      <nav class="flex gap-0.5">
        <a *ngFor="let link of navLinks"
           [routerLink]="link.path" routerLinkActive="active-nav"
           class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-muted text-[13px] font-medium transition-all hover:text-slate-200 hover:bg-white/5 no-underline"
           [class.active-nav]="false">
          <span>{{ link.icon }}</span>{{ link.label }}
        </a>
      </nav>

      <div class="flex items-center gap-2.5">
        <button *ngIf="compareCount() > 0"
          (click)="goCompare()"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-esg-blue/20 border border-esg-blue/40 text-esg-blue-l text-xs font-bold transition-all hover:bg-esg-blue/35">
          <span class="w-4 h-4 rounded-full bg-esg-blue text-white flex items-center justify-center text-[10px] font-extrabold">{{ compareCount() }}</span>
          Compare
        </button>
        <button (click)="logout()"
          class="w-8 h-8 rounded-full bg-gradient-to-br from-esg-blue to-esg-gov flex items-center justify-center text-xs font-bold text-white cursor-pointer border-none"
          [title]="'Logout: ' + userEmail()">
          {{ initials() }}
        </button>
      </div>
    </header>
  `,
  styles: [`
    a.active-nav {
      color: white !important;
      background: rgba(59, 114, 246, 0.15) !important;
      border: 1px solid rgba(59, 114, 246, 0.3);
    }
    :host ::ng-deep .router-link-active {
      color: white;
      background: rgba(59, 114, 246, 0.15);
      border: 1px solid rgba(59, 114, 246, 0.3);
    }
  `],
})
export class NavComponent {
  private auth    = inject(AuthService);
  private compare = inject(CompareService);
  private router  = inject(Router);

  compareCount = this.compare.count;
  userEmail    = this.auth.userEmail;

  navLinks = [
    { path: '/search',   icon: '', label: 'Search'   },
    { path: '/import',   icon: '', label: 'Import'   },
    { path: '/compare',  icon: '', label: 'Compare'  },
    { path: '/insights', icon: '', label: 'Insights' },
  ];

  initials = computed(() => {
    const e = this.auth.userEmail();
    return e ? e.substring(0, 2).toUpperCase() : 'U';
  });

  goCompare(): void {
    this.router.navigate(['/compare']);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth']);
  }
}
