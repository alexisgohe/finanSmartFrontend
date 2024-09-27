import { Usuario } from "./usuario.model";

export interface Ingreso {
  ingreso_id: number;
  descripcion_ingreso: string;
  fecha_ingreso: string;
  monto_ingreso: number;
  transferencia: number;
  categoria: number;
  usuario: Usuario;
}
