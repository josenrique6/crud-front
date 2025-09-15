import { InvoiceDetail } from "./InvoiceDetail";

export interface Invoice {
  id?: number;
  series: string;           // Ej. F001
  number: string;           // Ej. 000123
  date: string;             // ISO yyyy-MM-dd
  customerRuc: string;
  customerName: string;
  currency: 'PEN' | 'USD';
  subtotal: number;
  tax: number;
  total: number;
  details: InvoiceDetail[];
}
