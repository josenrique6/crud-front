export interface Product {
  id?: number;        // opcional para “nuevo”
  code: string;
  name: string;
  unitPrice: number;     // 2 decimales en la UI
  status?: boolean;    // activo/inactivo
}