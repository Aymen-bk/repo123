import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

/**
 * Handles the Google OAuth 2.0 callback.
 * Google redirects the browser back to the backend, which then redirects here
 * with a ready-made HK360 JWT: /auth/callback?token=<jwt>
 *
 * This component reads the token, stores it, and navigates to /search.
 */
@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center"
         style="background:#0A1628;">
      <div class="text-center">
        <div class="w-10 h-10 rounded-full border-2 border-esg-blue border-t-transparent animate-spin mx-auto mb-4"></div>
        <p class="text-muted text-sm">Completing sign-in…</p>
      </div>
    </div>
  `,
})
export class AuthCallbackComponent implements OnInit {
  private route  = inject(ActivatedRoute);
  private auth   = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    const error = this.route.snapshot.queryParamMap.get('error');

    if (token) {
      // Decode email from JWT payload (base64 middle part)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const email: string = payload['email'] ?? payload['sub'] ?? '';
        this.auth.storeToken(token, email);
        void this.router.navigate(['/search']);
      } catch {
        void this.router.navigate(['/auth'], { queryParams: { error: 'token_parse' } });
      }
    } else {
      void this.router.navigate(['/auth'], { queryParams: { error: error ?? 'oauth_error' } });
    }
  }
}
