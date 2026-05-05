import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  auth.checkStoredSession();
  if (auth.isLoggedIn()) return true;
  router.navigate(['/auth']);
  return false;
};
