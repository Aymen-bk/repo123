import { Component, inject, signal, ViewChildren, QueryList, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

type AuthStep = 'email' | 'otp' | 'loading';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center relative overflow-hidden"
         style="background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(27,79,216,0.18) 0%, transparent 70%), #0A1628;">

      <div class="absolute rounded-full border border-esg-blue/10 animate-spin-slow"
           style="width:600px;height:600px;top:50%;left:50%;transform:translate(-50%,-50%)"></div>
      <div class="absolute rounded-full border border-esg-blue/5 animate-spin-slow"
           style="width:900px;height:900px;top:50%;left:50%;transform:translate(-50%,-50%);animation-direction:reverse;animation-duration:50s"></div>

      <div class="relative z-10 w-[440px] max-w-[95vw] bg-card border border-border rounded-2xl p-10 shadow-2xl animate-fade-up"
           style="box-shadow: 0 40px 80px rgba(0,0,0,0.5), 0 0 40px rgba(27,79,216,0.12);">

        <div class="text-center mb-8">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-esg-blue to-esg-blue-l mx-auto flex items-center justify-center text-2xl mb-4">HK</div>
          <h1 class="font-syne text-2xl font-extrabold tracking-tight">HumanKind-360</h1>
          <p class="text-muted text-sm mt-1">ESG Intelligence Platform</p>
        </div>

        <div *ngIf="step() === 'email'">
          <p class="text-slate-300 text-sm mb-5 text-center">Enter your email to receive a one-time code</p>
          <div class="space-y-3">
            <div>
              <label class="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">Email address</label>
              <input [(ngModel)]="email" type="email" placeholder="analyst@fund.com"
                     class="hk-input w-full"
                     (keyup.enter)="sendOtp()"/>
            </div>
            <button (click)="sendOtp()" [disabled]="!email"
              class="hk-btn-primary w-full py-3 disabled:opacity-40 disabled:cursor-not-allowed">
              Send One-Time Code →
            </button>
          </div>

          <div class="flex items-center gap-3 my-5 text-muted text-xs">
            <div class="flex-1 h-px bg-border"></div> or <div class="flex-1 h-px bg-border"></div>
          </div>

          <button (click)="googleLogin()"
            class="w-full py-3 rounded-xl border border-border bg-white/4 hover:bg-white/8 text-slate-200 text-sm font-medium flex items-center justify-center gap-2.5 transition-all cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
              <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
              <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
              <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <div *ngIf="step() === 'otp'">
          <p class="text-slate-300 text-sm mb-1 text-center">Code sent to <span class="text-esg-blue-l font-semibold">{{ email }}</span></p>
          <p class="text-muted text-xs mb-6 text-center">Enter the 6-digit code from your email</p>

          <div class="flex gap-2 justify-center mb-6">
            <input *ngFor="let i of [0,1,2,3,4,5]; let idx = index"
                   #otpInputs
                   type="text" maxlength="1"
                   [(ngModel)]="otpDigits[idx]"
                   (input)="onOtpInput(idx, $event)"
                   (keydown.backspace)="onOtpBackspace(idx)"
                   class="w-12 h-14 text-center text-xl font-bold font-mono bg-white/5 border border-border rounded-xl text-white outline-none transition-all focus:border-esg-blue-l focus:bg-esg-blue/10 focus:shadow-[0_0_0_3px_rgba(59,114,246,0.15)]"
                   [class.border-esg-blue-l]="otpDigits[idx]"
                   [class.text-esg-blue-l]="otpDigits[idx]"/>
          </div>

          <div *ngIf="errorMsg()" class="text-red-400 text-sm text-center mb-4 bg-red-400/10 py-2 rounded-lg border border-red-400/20">
            {{ errorMsg() }}
          </div>

          <button (click)="verifyOtp()" [disabled]="otpString().length < 6"
            class="hk-btn-primary w-full py-3 disabled:opacity-40 disabled:cursor-not-allowed">
            Verify & Sign In →
          </button>
          <button (click)="step.set('email')" class="w-full mt-2 text-muted text-xs py-2 hover:text-slate-300 transition-colors cursor-pointer bg-transparent border-none">
            ← Change email
          </button>
        </div>

        <div *ngIf="step() === 'loading'" class="text-center py-6">
          <div class="w-10 h-10 rounded-full border-2 border-esg-blue border-t-transparent animate-spin mx-auto mb-4"></div>
          <p class="text-muted text-sm">Signing you in...</p>
        </div>

        <p class="text-center text-muted text-xs mt-6">
          Secured by HumanKind-360 · ESG Data Platform
        </p>
      </div>
    </div>
  `,
})
export class AuthComponent {
  @ViewChildren('otpInputs') otpInputs!: QueryList<ElementRef>;

  private authService = inject(AuthService);
  private router      = inject(Router);

  step     = signal<AuthStep>('email');
  email    = '';
  otpDigits: string[] = ['', '', '', '', '', ''];
  errorMsg = signal('');

  otpString = () => this.otpDigits.join('');

  async sendOtp(): Promise<void> {
    if (!this.email) return;
    this.step.set('loading');
    await this.authService.requestOtp(this.email);
    this.step.set('otp');
    setTimeout(() => this.otpInputs.first?.nativeElement.focus(), 100);
  }

  onOtpInput(idx: number, event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.otpDigits[idx] = val.slice(-1);
    if (val && idx < 5) {
      const inputs = this.otpInputs.toArray();
      inputs[idx + 1]?.nativeElement.focus();
    }
  }

  onOtpBackspace(idx: number): void {
    if (!this.otpDigits[idx] && idx > 0) {
      this.otpDigits[idx - 1] = '';
      this.otpInputs.toArray()[idx - 1]?.nativeElement.focus();
    }
  }

  async verifyOtp(): Promise<void> {
    this.errorMsg.set('');
    this.step.set('loading');
    const ok = await this.authService.verifyOtp(this.email, this.otpString());
    if (ok) {
      this.router.navigate(['/search']);
    } else {
      this.errorMsg.set('Invalid code. Please try again.');
      this.step.set('otp');
    }
  }

  async googleLogin(): Promise<void> {
    this.step.set('loading');
    this.authService.loginWithGoogle(); // redirects to /api/auth/google
  }
}
