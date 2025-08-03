import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort',
})
export class SortPipe implements PipeTransform {
  transform(data: any[], criteria: string): any[] {
    if (!Array.isArray(data) || !criteria) return data;

    switch (criteria) {
      case 'priceLow':
        return data.slice().sort((a, b) => a.price - b.price);
      case 'priceHigh':
        return data.slice().sort((a, b) => b.price - a.price);
      case 'nameAZ':
        return data.slice().sort((a, b) => a.title.localeCompare(b.title));
      default:
        return data;
    }
  }
}
