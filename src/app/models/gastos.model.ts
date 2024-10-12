import { Categoria } from "./categoria.model";
import { Usuario } from "./usuario.model";
import { TarjetaCredito } from "./tarjetaCredito.model";
import { Transferencia } from "./transferencia.model";

export interface Gasto {
  gasto_id: number;
  monto_gasto: number;
  fecha_gasto: string;
  descripcion_gasto: string;
  categoria: Categoria;
  usuario: Usuario;
  tarjeta: TarjetaCredito;
  transferencia?: Transferencia;
}
