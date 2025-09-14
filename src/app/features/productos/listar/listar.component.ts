import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { firstValueFrom } from 'rxjs';
import { Producto } from '../../../models/producto';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {

  productos: Producto[] = [];

  constructor(
    private productosService: ProductsService
  ) { }

  async ngOnInit() {
    var result = await firstValueFrom(this.productosService.listar());    
    this.productos = result;
  }
}
