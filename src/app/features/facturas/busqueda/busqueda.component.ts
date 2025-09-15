import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../../services/Invoice.service';
import { Invoice } from '../../../models/Invoice';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css']
})
export class BusquedaComponent implements OnInit {

  invoices: Invoice[] = [];
  fechaInicio: Date | undefined;
  fechaFin: Date | undefined;
  ruc: String = "";

  constructor(
    private invoiceSrv: InvoiceService,
    private router: Router
  ) { } 

  async ngOnInit() {
    await this.loadInvoices();
  }

  async loadInvoices() {
    var invoiceList = await firstValueFrom(this.invoiceSrv.getAll());
    this.invoices = invoiceList;
  }

  async searchInvoices(){
    var result = await firstValueFrom(this.invoiceSrv.getByFilters(this.fechaInicio, this.fechaFin, this.ruc ));
    this.invoices = result;
  }

  viewInvoice(id?: number) {    
    this.router.navigate(['/facturas/editar', id]);
  }

  async deleteInvoice(id?: number) {
    if (id && confirm('¿Está seguro de eliminar la factura ' + id + '?')) {
      var result = await firstValueFrom(this.invoiceSrv.delete(id));
      if (result){
        alert('Factura eliminada correctamente');
        await this.loadInvoices();
      } else {
        alert('Error al eliminar la factura');
      }
    }
  }
}
