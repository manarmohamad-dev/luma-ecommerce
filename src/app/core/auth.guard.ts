import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from './store.service';

export const authGuard = () => inject(StoreService).isAuthenticated() || inject(Router).createUrlTree(['/login']);
