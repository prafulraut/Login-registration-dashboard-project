import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SharedService } from '../service/shared.service';

export const authGuard: CanActivateFn = (route, state) => {
  const shared = inject(SharedService);
  const router = inject(Router);
  if (shared.userEmailSource.getValue()) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};
