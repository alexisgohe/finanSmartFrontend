import { Usuario } from "./usuario.model";

export interface TarjetaCredito {
  tarjeta_credito_id: number;
  nombre: string;
  banco_tarjeta: string;
  limite_credito: number;
  credito_utilizado: number;
  fecha_corte: string;
  fecha_pago: string;
  usuario: Usuario;
}
