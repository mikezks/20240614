import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { PreloadAllModules, provideRouter, withComponentInputBinding, withPreloading } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { APP_ROUTES } from './app.routes';
import { provideRouterFeature } from './shared/logic-router-state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(APP_ROUTES,
      withPreloading(PreloadAllModules),
      // withDebugTracing(),
      withComponentInputBinding()
    ),
    provideHttpClient(),
    provideStore(),
    provideEffects(),
    provideRouterFeature(), provideClientHydration()
  ]
};
