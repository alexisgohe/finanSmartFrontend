import { Usuario } from "./usuario.model";

export interface Categoria {
  categoria_id: number;
  descripcion: string;
  tipo: string;
  img: string;
  usuario: Usuario;
}
