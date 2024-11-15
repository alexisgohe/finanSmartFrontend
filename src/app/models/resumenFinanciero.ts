export interface MetaAhorro {
  descripcion: string;
  ahorro: number;
}

export interface TransaccionReciente {
  descripcion: string;
  fecha: Date;
  monto: number;
  img: string;
  tipo: string;
}

export interface EstadoFinanciero {
  total_ingresos: number;
  total_gastos: number;
  saldo_total: number;
  saldo_pendiente: number;
  metas_ahorro: MetaAhorro[];
  transacciones_recientes: TransaccionReciente[];
}
