import { Usuario } from "./usuario.model";

export interface TarjetaDebito {
  tarjeta_debito_id: number;
  nombre: string;
  banco_tarjeta: string;
  saldo: number;
  tipo: string;
  fecha_inicio: string;
  fecha_fin: string;
  usuario: Usuario;
}
