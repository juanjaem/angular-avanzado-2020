import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { Observable } from 'rxjs';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor(
  private http: HttpClient,

  ) { }


  // Getter para obtener el token del localStorage
  get token(): string {
    return localStorage.getItem('token') || '';
  }


  // Getter para obtener los headers con el x-token como parámetro
  get headers(): object {
    return {
      headers: {
        'x-token': this.token
      }
    };
  }


  private transformarUsuarios(resultados: any[]): Usuario[] {
    return resultados.map(
      user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid)
    );
  }


  buscar(tipo: 'usuarios' | 'medicos' | 'hospitales', termino: string): Observable<Usuario[]> {
    const url = `${base_url}/todo/coleccion/${tipo}/${termino}`;

    return this.http.get<Usuario[]>(url, this.headers).pipe(
      map( (resp: any) => {
        switch (tipo) {
          case 'usuarios':
            return this.transformarUsuarios(resp.resultado);
            break;

          default:
            return [];
        }
      } )
    );

  }





}
