import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacturasRoutingModule } from './facturas-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistrarComponent } from './registrar/registrar.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BusquedaComponent } from './busqueda/busqueda.component';


@NgModule({
  declarations: [RegistrarComponent, BusquedaComponent],
  imports: [
    CommonModule,
    FacturasRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forChild(),
  ]
})
export class FacturasModule { }
