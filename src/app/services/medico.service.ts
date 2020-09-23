import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { Medico } from '../models/medico.model';
import { catchError, map } from 'rxjs/operators';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

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


  cargarMedicos(): Observable<Medico[]> {
    const url = `${base_url}/medicos`;

    return this.http.get(url, this.headers).pipe(
      map((resp: {ok: boolean, medicos: Medico[]}) => resp.medicos)
    );
  }


  cargarMedicoPorId(id: string): Observable<Medico> {
    const url = `${base_url}/medicos/${id}`;

    return this.http.get(url, this.headers).pipe(
      map( (resp: {ok: boolean, medico: Medico}) => resp.medico ),
      catchError(err => of(null) ) // Si hay algún error, devolver un null
    );
  }


  crearMedico( medico: {nombre: string, hospital: string} ): Observable<Medico> {
    const data = {
      nombre: medico.nombre,
      hospital_id: medico.hospital
    };
    const url = `${base_url}/medicos`;
    return this.http.post<{ok: boolean, medico: Medico}>(url, data, this.headers).pipe(
      map(res => res.medico)
    );
  }


  actualizarMedico(medico: Medico): Observable<Medico> {
    const url = `${base_url}/medicos/${medico._id}`;
    return this.http.put<{ok: boolean, medico: Medico}>(url, medico, this.headers).pipe(
      map(res => res.medico)
    );
  }


  borrarMedico(medico: Medico): Observable<any> {
    const url = `${base_url}/medicos/${medico._id}`;
    return this.http.delete(url, this.headers);
  }

}
