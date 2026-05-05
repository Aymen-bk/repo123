import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavComponent } from './shared/components/nav/nav.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavComponent],
  template: `
    <div class="flex flex-col min-h-screen bg-navy">
      <app-nav *ngIf="showNav"></app-nav>
      <main class="flex-1">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  private auth   = inject(AuthService);
  showNav = false;

  ngOnInit(): void {
    this.auth.checkStoredSession();
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      this.showNav = !e.url.includes('/auth');
    });
  }
}
