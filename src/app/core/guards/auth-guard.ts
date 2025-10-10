import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { switchMap, take } from 'rxjs/operators';
import { APP_ROUTES } from '../../constants/app-routes.const';
import { AuthService } from '../services/auth.service';
import { User as UserService } from '../services/user';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const userService = inject(UserService);

  return authService.user$.pipe(
    take(1),
    switchMap((user) => {
      if (!user) {
        return [router.createUrlTree([APP_ROUTES.LOGIN])];
      }

      return authService.githubUsername$.pipe(
        take(1),
        switchMap(async (githubId) => {
          if (!githubId) {
            return router.createUrlTree([APP_ROUTES.LOGIN]);
          }

          const profileExists = await userService.doesUserProfileExist(githubId);
          if (!profileExists) {
            authService.isNavigatingToRegister = true;
            router.navigateByUrl(router.createUrlTree([APP_ROUTES.REGISTER_STUDENT]), {
              replaceUrl: true,
            });
            return false;
          }

          return true;
        }),
      );
    }),
  );
};
