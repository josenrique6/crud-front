import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  public baseUrl = 'http://localhost:5065/api/products';
  public headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'accept': 'text/plain',
  });

  constructor(
    private http: HttpClient
  ) {}

  listar(){
    return this.http.get<Producto[]>(this.baseUrl);
  }

}
