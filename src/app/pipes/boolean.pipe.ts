import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'BooleanPipe',
})
export class BooleanPipe implements PipeTransform {
  transform(value: boolean): string {
    return value ? 'Sí' : 'No';
  }
}
