import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { APP_ROUTES } from '../../constants/app-routes.const';
import { AuthService } from '../services/auth.service';

export const githubAuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user$.pipe(
    take(1),
    map((user) => {
      if (user && authService.githubUsername$.value) {
        return true;
      }
      return router.createUrlTree([APP_ROUTES.LOGIN]);
    }),
  );
};
