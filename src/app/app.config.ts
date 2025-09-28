import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {
  ApplicationConfig,
  ErrorHandler,
  importProvidersFrom,
  inject,
  isDevMode,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { MatIconRegistry } from '@angular/material/icon';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { MarkdownModule } from 'ngx-markdown';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { ProfileEffects } from './pages/profile/store/profile.effects';
import { name as profileFeatureName, profileReducer } from './pages/profile/store/profile.reducer';
import { GITHUB_USERNAME_KEY } from './token';
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    console.error('Global Error:', error);
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    provideHttpClient(withInterceptorsFromDi()),

    importProvidersFrom(MarkdownModule.forRoot()),
    provideAppInitializer(() => {
      const iconRegistry = inject(MatIconRegistry);
      iconRegistry.setDefaultFontSetClass('material-symbols-outlined');
      return undefined;
    }),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    { provide: GITHUB_USERNAME_KEY, useValue: 'githubUsername' },
    provideStore({ [profileFeatureName]: profileReducer }),
    provideEffects([ProfileEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      connectInZone: true,
    }),
  ],
};
