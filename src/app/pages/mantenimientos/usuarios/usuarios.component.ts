import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import { BusquedasService } from '../../../services/busquedas.service';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios: number = 0;
  public pagina: number = 0;
  public usuarios: Usuario[] = [];
  public cargando: boolean = true;
  public busqueda: string = '';
  public imagenSubs: Subscription;


  constructor(
    private usuarioService: UsuarioService,
    private busquedasService: BusquedasService,
    private modalImagenService: ModalImagenService,
  ) { }


  ngOnDestroy(): void {
    this.imagenSubs.unsubscribe();
  }


  ngOnInit(): void {
    this.cargarUsuarios();

    // Suscripción para que cuando se actualice la imagen, se haga una nueva petición para obtener el usuario con la img actualizada
    this.imagenSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(100)) // Retardo para dar tiempo a que el servidor procese la img
      .subscribe( img => {
        if (this.busqueda.length === 0) {
          this.cargarUsuarios();
        } else {
          this.buscar();
        }
      });
  }


  cargarUsuarios(): void {
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.pagina * 5).subscribe( ({total, usuarios}) => {
      this.totalUsuarios = total;
      this.usuarios = usuarios;
      this.cargando = false;
    });
  }


  cambiarPagina(valor: number): void {
    this.pagina += valor;

    if (this.pagina < 0) {
      this.pagina = 0;
    } else if (this.pagina * 5 >= this.totalUsuarios) {
      this.pagina -= 1;
    }

    this.cargarUsuarios();
  }


  // Buscar usuarios
  buscar(): void {
    if (!this.busqueda || this.busqueda === '') {
      this.cargarUsuarios();
      return;
    }

    this.busquedasService.buscar('usuarios', this.busqueda)
      .subscribe( (resp: Usuario[]) => {
        this.usuarios = resp;
      } );
  }


  eliminarUsuario(usuario: Usuario): void {

    if (usuario.uid === this.usuarioService.usuario.uid) {
      Swal.fire('Error', 'No puede borrarse a si mismo', 'error');
      return;
    }

    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Está a punto de borrar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {

        this.usuarioService.eliminarUsuario(usuario)
          .subscribe( resp => {
            Swal.fire(
              'Usuario Borrado',
              `${usuario.nombre} fue eliminado correctamente`,
              'success'
            );

            if (this.busqueda.length === 0) {
              this.cargarUsuarios();
            } else {
              this.buscar();
            }
          });
      }
    });
  }


  cambiarRole(usuario: Usuario): void {
    this.usuarioService.guardarUsuario(usuario).subscribe( resp => {
      console.log(resp);
    });
  }


  abrirModal(usuario: Usuario): void {
    this.modalImagenService.abrirModal('usuarios', usuario.uid, usuario.img);
  }



}
