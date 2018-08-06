import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'buscaNome'
})
export class BuscaNomePipe implements PipeTransform {

  transform(users: any, searchText: any): any {
    if(searchText == null) return users;
    return users.filter(function(users){
      return users.nome.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
    })
  }

}
