import { Usuario } from "./usuario.model";
import { TarjetaCredito } from "./tarjetaCredito.model";
import { Gasto } from "./gastos.model";

export interface CompraMeses {
  compra_meses_id: number;
  monto_total: number;
  monto_mensual: number;
  num_meses: number;
  fecha_compra: string;
  descripcion: string;
  tarjeta: TarjetaCredito;
  usuario: Usuario;
  gasto: Gasto;
  meses_restantes: number;
  proximo_pago: Date;
}
