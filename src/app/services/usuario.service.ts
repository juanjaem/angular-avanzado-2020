import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

import { RegisterForm } from '../interface/register-form.interface';
import { LoginForm } from '../interface/login-form.interface';
import { Router } from '@angular/router';

const base_url = environment.base_url;
declare const gapi: any; // Lo definimos para usarlo, porque viene del archivo de JS de google que pusimos en el index


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.googleInit();
  }


  googleInit(): Promise<void> {
    // En realidad solo hay que inicializarlo una vez. Aunque no pasa nada porque se inicialice varias veces.
    // Podriamos evitarlo, pero aumentaríamos el código innecesariamente
    return new Promise( (resolve) => {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '1044648781367-c7j3jca4gtptu5qle56kmhs6sgcgra6d.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });
        resolve();
      });
    });
  }

  logout(): void {
    localStorage.removeItem('token');

    this.auth2.signOut().then(() =>  {
      // Como hacemos la navegación desde librerias de terceros, hay que ejecutar el ngzone.run para que la vista se
      // actualice correctamente
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      });
    });
  }


  validarToken(): Observable<boolean> {
    const token = localStorage.getItem('token') || '';
    // La petición /login/renew comprueba el token actual:
    //  - Si es válido, devuelve un nuevo token en un status 200
    //  - Si no lo es, devuelve un status 401
    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': token
      }
    }).pipe(
      tap( (resp: any) => {
        localStorage.setItem('token', resp.token);
      }),
      map(resp => true), // Si tenemos una respuesta es xk se ha validado el token correctamente, y sustituimos el {token: ''} por un true
      catchError( error => of(false) ) // Atrapamos cualquier error que ocurra en el flujo y devuelve un nuevo observable con el valor false
                                       // of(false) que quiere decir que no se logró pasar la autenticacion (Status 401 x ejemplo)
                                       // Si hay error, entrará a este catch antes que a cualquier otro operador que haya en el map
    );
  }


  crearUsuario( formData: RegisterForm ): Observable<any> {
    return this.http.post(`${base_url}/usuarios`, formData)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token);
        })
      );
  }


  login( formData: LoginForm ): Observable<any> {
    return this.http.post(`${base_url}/login`, formData)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token);
        })
      );
  }


  loginGoogle( token: string ): Observable<any> {
    return this.http.post(`${base_url}/login/google`, { token })
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token);
        })
      );
  }

}
