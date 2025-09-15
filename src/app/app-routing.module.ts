import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductosModule } from './features/productos/productos.module';
import { FacturasModule } from './features/facturas/facturas.module';

const routes: Routes = [
  {
    path: 'productos', loadChildren: () => import('./features/productos/productos.module').then(m => m.ProductosModule)
  },
  {
    path: 'facturas', loadChildren: () => import('./features/facturas/facturas.module').then(m => m.FacturasModule)
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
