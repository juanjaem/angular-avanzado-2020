import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {

  // tslint:disable-next-line: variable-name
  private _ocultarModal: boolean = true;

  public tipo: 'usuarios'| 'medicos'| 'hospitales';
  public id: string;
  public img: string = '';

  public nuevaImagen: EventEmitter<string> = new EventEmitter<string>(); // Notificar al componente que se cambió la imagen

  get ocultarModalFlag(): boolean {
    return this._ocultarModal;
  }


  abrirModal(
    tipo: 'usuarios'| 'medicos'| 'hospitales',
    id: string,
    img: string  // La imagen ya se pasa con la url completa
  ): void {
    this.tipo = tipo;
    this.id = id;

    if (!img) {
      this.img = `${base_url}/upload/usuarios/no-image.jpg`;
    } else if (img.includes('https')) {
      this.img = img;
    } else {
      this.img = `${base_url}/upload/${tipo}/${img}`;
    }

    this._ocultarModal = false;
  }


  cerrarModal(): void {
    this._ocultarModal = true;
  }

  constructor() { }
}
