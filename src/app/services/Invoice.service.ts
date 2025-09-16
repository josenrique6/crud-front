import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Invoice } from '../models/Invoice';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private baseUrl = `${environment.apiUrl}/invoice`;

  constructor(private http: HttpClient) {}

  create(payload: Invoice): Observable<number> {
    return this.http.post<number>(this.baseUrl, payload);
  }

  getAll(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.baseUrl);
  }

  getById(id: number): Observable<Invoice> {
    const url = `${this.baseUrl}/id/${id}`;
    return this.http.get<Invoice>(url);
  }

  update(payload: Invoice): Observable<number> {
    return this.http.put<number>(this.baseUrl, payload);
  }

  delete(id: number): Observable<boolean> {    
    const body = { id: id };
    return this.http.delete<boolean>(`${this.baseUrl}`, { body: body });
  }

  getByFilters(fechaInicio?: Date, fechaFin?: Date, customerRuc?: String): Observable<Invoice[]> {
    const body = {
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      ruc: customerRuc
    };
    return this.http.post<Invoice[]>(`${this.baseUrl}/filtros`, body);
  }
}
