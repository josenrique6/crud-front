export interface InvoiceDetail {
  id?: number;
  invoiceId?: number;
  productId: number;
  productCode?: string;
  productName?: string;
  quantity: number;
  price: number;
  amount: number;
}
