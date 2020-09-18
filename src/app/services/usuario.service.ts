import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { RegisterForm } from '../interface/register-form.interface';
import { LoginForm } from '../interface/login-form.interface';
import { CargarUsuario } from '../interface/cargar-usuarios.interface';

import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url;
declare const gapi: any; // Lo definimos para usarlo, porque viene del archivo de JS de google que pusimos en el index

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario = new Usuario('', ''); // Datos del usuario que nos devuelve la petición 'validarToken'
                           // No es necesario cargarlo en ningun otro lugar, pues solo lo necesitamos dentro del Guard
                           // y el guard ejecuta siempre el validar token al entrar a la zona protegida

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.googleInit();
  }

  // Getter para obtener el token del localStorage
  get token(): string {
    return localStorage.getItem('token') || '';
  }

  // Getter con el id del usuario logueado
  get uid(): string {
    return this.usuario.uid || '';
  }

  // Getter para obtener los headers con el x-token como parámetro
  get headers(): object {
    return {
      headers: {
        'x-token': this.token
      }
    };
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


  // Valida el token almacenado en el storage, y si el válido, lo renueva
  validarToken(): Observable<boolean> {
    // La petición /login/renew comprueba el token actual:
    //  - Si es válido, devuelve un nuevo token en un status 200
    //  - Si no lo es, devuelve un status 401
    return this.http.get(`${base_url}/login/renew`, this.headers).pipe(
      map( (resp: any) => {
        localStorage.setItem('token', resp.token);
        const { nombre, email, img, google, role, uid } = resp.usuario;
        this.usuario = new Usuario(nombre, email, '', img, google, role, uid);
        return true; // Si tenemos una respuesta es xk se ha validado el token correctamente, y sustituimos el {token: ''} por un true
      }),
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


  // Inicializa las variables que necesita googleSignIn
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


  // Realiza el login con googleSignIn
  loginGoogle( token: string ): Observable<any> {
    return this.http.post(`${base_url}/login/google`, { token })
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token);
        })
      );
  }


  actualizarPerfil( data: {email: string, nombre: string, role: string} ): Observable<any> {
    data = {
      ...data,
      role: this.usuario.role
    };
    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, this.headers);
  }


  cargarUsuarios(desde: number = 0, ): Observable<CargarUsuario> {
    const url = `${base_url}/usuarios?desde=${desde}`;

    return this.http.get<CargarUsuario>(url, this.headers).pipe(
      // Podríamos haber hecho la transformación de la imagen con un pipe desde el HTML, pero lo haremos desde aquí
      // como alternativa educativa. Lo que se hará es transformar el array para que sean de la clase Usuario, y disponga
      // del getter 'imagenUrl', y poder usarlo directamente en el HTML
      map( resp => {
        const usuarios: Usuario[] =  resp.usuarios.map( user => {
                            return new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid);
                          });

        return {
          total: resp.total,
          usuarios
        };
      })
    );
  }


  eliminarUsuario(usuario: Usuario): Observable<any> {
    const url = `${base_url}/usuarios/${usuario.uid}`;
    return this.http.delete(url, this.headers);
  }


 guardarUsuario( usuario: Usuario ): Observable<any> {
    return this.http.put(`${base_url}/usuarios/${usuario.uid}`, usuario, this.headers);
  }


}
