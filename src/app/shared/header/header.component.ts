import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent {

  public usuario: Usuario;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.usuario = this.usuarioService.usuario;
  }

  logout(): void {
    this.usuarioService.logout();
  }

  buscar(termino: string): void {
    if (termino.length === 0) {
      this.router.navigateByUrl(`/dashboard`);
      return;
    }
    this.router.navigateByUrl(`/dashboard/buscar/${termino}`);
  }
}
