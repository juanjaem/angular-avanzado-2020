import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Hospital } from '../models/hospital.model';
import { map } from 'rxjs/operators';

const base_url = environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class HospitalService {


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


  cargarHospitales(): Observable<Hospital[]> {
    const url = `${base_url}/hospitales`;

    return this.http.get(url, this.headers).pipe(
      map((resp: {ok: boolean, hospitales: Hospital[]}) => resp.hospitales)
    );
  }


  crearHospital(nombre: string): Observable<Hospital> {
    const url = `${base_url}/hospitales`;
    return this.http.post<Hospital>(url, {nombre}, this.headers);
  }


  actualizarHospital(_id: string, nombre: string): Observable<Hospital> {
    const url = `${base_url}/hospitales/${_id}`;
    return this.http.put<Hospital>(url, {nombre}, this.headers);
  }


  borrarHospital(_id: string): Observable<any> {
    const url = `${base_url}/hospitales/${_id}`;
    return this.http.delete(url, this.headers);
  }

}
