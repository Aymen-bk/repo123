import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private _isLoggedIn = signal(false);
  private _userEmail = signal('');
  private _token = signal<string | null>(null);

  readonly isLoggedIn = this._isLoggedIn.asReadonly();
  readonly userEmail  = this._userEmail.asReadonly();

  private readonly tokenKey = 'hk_token';
  private readonly emailKey = 'hk_email';

  async loginMockGoogle(email: string, name: string): Promise<void> {
    const res = await firstValueFrom(
      this.http.post<{ token: string; user: { email: string } }>('http://localhost:8081/api/auth/mock-google', {
        email,
        name,
      }),
    );
    this._isLoggedIn.set(true);
    this._userEmail.set(res.user.email);
    this._token.set(res.token);
    localStorage.setItem(this.tokenKey, res.token);
    localStorage.setItem(this.emailKey, res.user.email);
  }

  requestOtp(email: string): Promise<void> {
    return new Promise(resolve => setTimeout(() => resolve(), 800));
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 600));
    if (!(otp === '123456' || otp.length === 6)) return false;
    await this.loginMockGoogle(email, 'OTP User');
    return true;
  }

  loginWithGoogle(): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        this._isLoggedIn.set(true);
        this._userEmail.set('user@gmail.com');
        localStorage.setItem(this.emailKey, 'user@gmail.com');
        resolve();
      }, 700);
    });
  }

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
}
