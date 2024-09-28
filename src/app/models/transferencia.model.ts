import { TarjetaDebito } from "./tarjetaDebito.model";
import { TarjetaCredito } from "./tarjetaCredito.model";

export interface Transferencia {
  transferencia_id: number;
  monto: number;
  fecha: string;
  cuenta_origen_debito: TarjetaDebito;
  cuenta_destino_debito: TarjetaDebito;
  cuenta_origen_credito: TarjetaCredito;
  cuenta_destino_credito: TarjetaCredito;
}
