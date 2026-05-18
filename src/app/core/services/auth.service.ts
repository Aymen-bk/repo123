import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

interface AuthResponse {
  token: string;
  user: { userId: string; email: string; name: string };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private base = 'http://localhost:8081/api';

  private _isLoggedIn = signal(false);
  private _userEmail  = signal('');
  private _token      = signal<string | null>(null);

  readonly isLoggedIn = this._isLoggedIn.asReadonly();
  readonly userEmail  = this._userEmail.asReadonly();

  private readonly tokenKey = 'hk_token';
  private readonly emailKey = 'hk_email';

  // ── OTP flow ─────────────────────────────────────────────────────────────

  /** Sends a real OTP email via backend. */
  async requestOtp(email: string): Promise<void> {
    await firstValueFrom(
      this.http.post(`${this.base}/auth/otp/request`, { email })
    );
  }

  /** Verifies OTP with backend; returns true and stores token on success. */
  async verifyOtp(email: string, code: string): Promise<boolean> {
    try {
      const res = await firstValueFrom(
        this.http.post<AuthResponse>(`${this.base}/auth/otp/verify`, { email, code })
      );
      this._storeSession(res);
      return true;
    } catch {
      return false;
    }
  }

  // ── Google OAuth 2.0 ─────────────────────────────────────────────────────

  /** Gets the Google authorization URL from backend, then redirects the browser. */
  async loginWithGoogle(): Promise<void> {
    const res = await firstValueFrom(
      this.http.get<{ url: string }>(`${this.base}/auth/oauth2/authorize/google`)
    );
    window.location.href = res.url;
  }

  /** Called by AuthCallbackComponent after Google redirects back with a token. */
  storeToken(token: string, email: string): void {
    this._isLoggedIn.set(true);
    this._userEmail.set(email);
    this._token.set(token);
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.emailKey, email);
  }

  // ── Session ───────────────────────────────────────────────────────────────

  logout(): void {
    this._isLoggedIn.set(false);
    this._userEmail.set('');
    this._token.set(null);
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.emailKey);
  }

  checkStoredSession(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      this._isLoggedIn.set(true);
      this._token.set(token);
      this._userEmail.set(localStorage.getItem(this.emailKey) || '');
    }
  }

  getToken(): string | null {
    return this._token();
  }

  // ── Private ───────────────────────────────────────────────────────────────

  private _storeSession(res: AuthResponse): void {
    this._isLoggedIn.set(true);
    this._userEmail.set(res.user.email);
    this._token.set(res.token);
    localStorage.setItem(this.tokenKey, res.token);
    localStorage.setItem(this.emailKey, res.user.email);
  }
}
