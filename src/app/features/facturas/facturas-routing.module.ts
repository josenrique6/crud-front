import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrarComponent } from './registrar/registrar.component';
import { BusquedaComponent } from './busqueda/busqueda.component';

const routes: Routes = [  
  {path: 'registrar', component : RegistrarComponent},
  {path: 'editar/:id', component : RegistrarComponent},
  {path: 'busqueda', component : BusquedaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacturasRoutingModule { }
