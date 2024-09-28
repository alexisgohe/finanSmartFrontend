import { Usuario } from "./usuario.model";
import { Categoria } from "./categoria.model";
import { Transferencia } from "./transferencia.model";

export interface Ingreso {
  ingreso_id: number;
  descripcion_ingreso: string;
  fecha_ingreso: string;
  monto_ingreso: number;
  transferencia: Transferencia;
  categoria: Categoria;
  usuario: Usuario;
}
