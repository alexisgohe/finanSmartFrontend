import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'CategoriasPipe',
})
export class CategoriasPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'A':
        return 'Ahorro';
      case 'G':
        return 'Gasto';
      case 'I':
        return 'Ingreso';
      default:
        return 'Desconocido';  // Opcional
    }
  }
}
