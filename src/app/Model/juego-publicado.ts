export interface JuegoPublicado {
  id: string;
  nombre: string;
  precio: number;
  descuento: number;
  descripcion: string;
  imagen: string;
  tags: string[];
  plataformas: string[];
  fechaPublicacion: string;
  empresaNombre: string;
  empresaEmail: string;
  activo: boolean;
}
