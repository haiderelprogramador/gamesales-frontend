export interface Producto {
  nombre: string;
  precio: number;
  imagen: string;
  slug?: string;
  developer?: string;
  tags?: string[];
  fechaCompra?: string;
  fechaAgregado?: string;
}
