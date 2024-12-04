import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { interceptorProvider } from './interceptors/interceptor.service';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
              importProvidersFrom(HttpClientModule),
              importProvidersFrom(ToastrModule.forRoot()),
              importProvidersFrom(BrowserAnimationsModule),
              importProvidersFrom(BrowserModule),
              importProvidersFrom(NoopAnimationsModule),
              interceptorProvider
            ]
};
