import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanLoad, Route, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}


  // PARA LAZY LOAD
  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.usuarioService.validarToken().pipe(
      tap( estaAutenticado => { // Este tap se encarga de la redirección al login en caso de que la autenticacion falle
          if ( !estaAutenticado ) {
            this.router.navigateByUrl('/login');
          }
        }
      )
    );
  }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.usuarioService.validarToken().pipe(
      tap( estaAutenticado => { // Este tap se encarga de la redirección al login en caso de que la autenticacion falle
          if ( !estaAutenticado ) {
            this.router.navigateByUrl('/login');
          }
        }
      )
    );
  }

}
