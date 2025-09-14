import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarComponent } from './listar/listar.component';
import { MainComponent } from './main/main.component';
import { RegistrarComponent } from './registrar/registrar.component';

const routes: Routes = [  
  {path: 'facturas' , component:MainComponent},
  {path: 'facturas/registrar', component : RegistrarComponent},
  {path: 'facturas/listar', component : ListarComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacturasRoutingModule { }
