import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ProductosModule } from './features/productos/productos.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FacturasModule } from './features/facturas/facturas.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AuthModule } from './features/auth/auth.module';
import { AuthInterceptor } from './services/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ProductosModule,
    HttpClientModule,
    FacturasModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    AuthModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync('noop'),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
