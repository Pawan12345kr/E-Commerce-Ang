import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const adminGuardGuard: CanActivateFn = (route, state) => {

  const role=sessionStorage.getItem('Role');
  const router = inject(Router)
  if(role=='Admin')
  {
    return true;
  }
  else
  {
    router.navigate(['']);
    return false;
  }
};
