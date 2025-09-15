import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { firstValueFrom } from 'rxjs';
import { Product } from '../../../models/product';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent implements OnInit {

  productos: Product[] = [];

  constructor(
    private productosService: ProductService
  ) { }

  async ngOnInit() {
    var result = await firstValueFrom(this.productosService.getAll());    
    this.productos = result;
  }
}
