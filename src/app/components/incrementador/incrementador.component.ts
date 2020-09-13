import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: [
  ]
})
export class IncrementadorComponent {

  // tslint:disable-next-line: no-input-rename
  @Input('valor') progreso: number = 50; // 'valor' renombre el input. Si no lo ponemos, el nombres sería el de la variable ('progreso')
  @Input() btnClass: string = 'btn btn-primary'; // Los botones recibiran las clases a traves de este input

  @Output() valorSalida: EventEmitter<number> = new EventEmitter();

  // Metodo para cambiar el valor de la barra de porcentaje
  cambiarValor(valor: number): void {
    const newProgreso = this.progreso + valor;

    if (newProgreso > 100) {
      this.progreso = 100;
      this.valorSalida.emit(this.progreso);
      return;
    }

    if (newProgreso < 0) {
      this.progreso = 0;
      this.valorSalida.emit(this.progreso);
      return;
    }

    this.progreso = newProgreso;
    this.valorSalida.emit(this.progreso);
  }


  inputChanged(nuevoValor: number): void {
    if (nuevoValor >= 100) {
      this.progreso = 100;
    } else if (nuevoValor <= 0) {
      this.progreso = 0;
    } else {
      this.progreso = nuevoValor;
    }

    this.valorSalida.emit(this.progreso);
  }

}
