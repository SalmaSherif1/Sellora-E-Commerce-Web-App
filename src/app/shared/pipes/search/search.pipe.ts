import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform(data: any[], text: string): any {
    return data.filter((item) =>
      item.title.toLowerCase().includes(text.toLowerCase())
    );
  }
}
