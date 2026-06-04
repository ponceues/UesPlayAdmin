import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import {  TooltipOptions } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { httpErrorInterceptor } from './app/interceptors/http-error/http-error.interceptor';
import { tokenJwtInterceptor } from './app/interceptors/token-twt/token-jwt.interceptor';
import { tokenRefreshInterceptor } from './app/interceptors/token-refresh/token-refresh.interceptor';
import { definePreset } from '@primeng/themes';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

// Register Spanish locale
registerLocaleData(localeEs);

export const tooltipOptions: TooltipOptions = {
    positionTop:-10,
    tooltipPosition: 'top',
}

export const appConfig: ApplicationConfig = {
    providers: [
        { provide: LOCALE_ID, useValue: 'es' },
        provideRouter(appRoutes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
        provideHttpClient(
            withFetch(),
            withInterceptors([tokenJwtInterceptor, tokenRefreshInterceptor, httpErrorInterceptor])
        ),
        provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: definePreset(Aura,{}),

                options: {
                    darkModeSelector: '.app-dark'
                }
            },
            ripple: true,
            translation: {
                startsWith: 'Empieza con',
                contains: 'Contiene',
                notContains: 'No contiene',
                endsWith: 'Termina con',
                equals: 'Igual a',
                notEquals: 'Diferente de',
                noFilter: 'Sin filtro',
                lt: 'Menor que',
            }
        }),
        {
            provide: 'DefaultTooltipOptions',
            useValue: tooltipOptions
        },
        MessageService,
    ]
};
