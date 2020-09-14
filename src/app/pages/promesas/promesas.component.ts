import { Component, OnInit } from '@angular/core';
import { rejects } from 'assert';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ]
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    // PROMESAS  (Ejercicio 1)--------------
    // const promesa = new Promise( (resolve, reject) => {

    //   if (false) {
    //     resolve('Hola mundo');
    //   } else {
    //     reject('Algo salió mal');
    //   }
    // });

    // promesa.then( (mensaje) => {
    //   console.log(mensaje);
    // })
    // .catch((err) => {
    //   console.log('error en mi promesa: ' + err);
    // });
    // --------------------------------


    this.getUsuarios().then(usuarios => console.log(usuarios)); // (Ejercicio 2)

  }


  // PROMESAS  (Ejercicio 2)--------------
  getUsuarios(): Promise<any> {
    return new Promise(resolve => {

      fetch('https://reqres.in/api/users?page=2')
      .then( resp => resp.json() )
      .then( body => resolve(body.data));

    });
  // --------------------------------

  }






}
