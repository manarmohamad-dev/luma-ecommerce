import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from './store.service';

export const adminGuard = () => {
  const store = inject(StoreService);
  return store.isAdmin() || inject(Router).createUrlTree(['/login']);
};
