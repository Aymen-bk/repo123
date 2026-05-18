import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

/**
 * Handles the redirect from Google OAuth:
 *   /oauth-callback?token=JWT&email=...&name=...
 *   /oauth-callback?error=...
 */
@Component({
  selector: 'app-oauth-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0A1628;color:#E2E8F0;font-family:'DM Sans',sans-serif;">
      <div style="text-align:center">
        <div *ngIf="!errMsg()" style="font-size:14px;color:#7B91B0">
          <div style="width:40px;height:40px;border-radius:50%;border:2px solid #3B72F6;border-top-color:transparent;animation:spin 0.8s linear infinite;margin:0 auto 16px"></div>
          Signing you in...
        </div>
        <div *ngIf="errMsg()" style="color:#EF4444;font-size:14px">
          Authentication failed: {{ errMsg() }}<br>
          <a href="/auth" style="color:#3B72F6;margin-top:8px;display:inline-block">← Back to Sign In</a>
        </div>
      </div>
    </div>
  `,
})
export class OAuthCallbackComponent implements OnInit {
  private route  = inject(ActivatedRoute);
  private router = inject(Router);
  private auth   = inject(AuthService);

  errMsg = signal('');

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    const errParam = params.get('error');
    if (errParam) {
      this.errMsg.set(errParam);
      return;
    }
    const token = params.get('token') || '';
    const email = params.get('email') || '';
    const name  = params.get('name') || '';
    if (token) {
      this.auth.consumeOAuthCallback(token, email, name);
      void this.router.navigate(['/search']);
    } else {
      this.errMsg.set('missing_token');
    }
  }
}
