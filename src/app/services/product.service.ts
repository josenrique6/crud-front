import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  public baseUrl = 'http://localhost:5065/api/products';
  public headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'accept': 'text/plain',
  });

  constructor(
    private http: HttpClient
  ) {}

  getAll(): Observable<Product[]> {
    // return this.http.get<Product[]>(this.baseUrl);
    // Provisorio (mock) por si aún no tienes API lista:
    // return of([
    //   { id: 1, code: 'P001', name: 'Teclado', unitPrice: 59.9 },
    //   { id: 2, code: 'P002', name: 'Mouse', unitPrice: 39.5 },
    //   { id: 3, code: 'P003', name: 'Monitor 24"', unitPrice: 799.0 },
    // ]);
    return this.http.get<Product[]>(this.baseUrl, { headers: this.headers });
  }

}
