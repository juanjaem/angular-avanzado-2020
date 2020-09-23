import { Component, OnDestroy, OnInit } from '@angular/core';
import { Medico } from '../../../models/medico.model';
import { Subscription } from 'rxjs';
import { MedicoService } from '../../../services/medico.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public medicos: Medico[] = [];
  public cargando: boolean = true;
  public busqueda: string = '';
  private imagenSubs: Subscription;

  constructor(
    private medicoService: MedicoService,
    private modalImagenService: ModalImagenService,
    private busquedasService: BusquedasService,
  ) { }


  ngOnDestroy(): void {
    this.imagenSubs.unsubscribe();
  }


  ngOnInit(): void {
    this.cargarMedicos();

    // Suscripción para que cuando se actualice la imagen, se haga una nueva petición para obtener el medico con la img actualizada
    this.imagenSubs = this.modalImagenService.nuevaImagen
    .pipe(delay(100)) // Retardo para dar tiempo a que el servidor procese la img
    .subscribe( img => {
      this.cargarMedicos();
    });
  }


  cargarMedicos(): void {
    this.cargando = false;
    this.medicoService.cargarMedicos().subscribe(medicos => {
      this.medicos = medicos;
      this.cargando = false;
    });
  }


  guardarCambios(medico: Medico): void {
    this.medicoService.actualizarMedico(medico).subscribe(resp => {
      Swal.fire('Actualizado', medico.nombre, 'success');
    });
  }


  eliminarMedicos(medico: Medico): void {
    Swal.fire({
      title: '¿Borrar médico?',
      text: `Está a punto de borrar a ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {

        this.medicoService.borrarMedico(medico)
          .subscribe( resp => {
            Swal.fire(
              'Médico Borrado',
              `${medico.nombre} fue eliminado correctamente`,
              'success'
            );

            if (this.busqueda.length === 0) {
              this.cargarMedicos();
            } else {
              this.buscar();
            }
          });
      }
    });
  }


  abrirModal(medico: Medico): void {
    this.modalImagenService.abrirModal('medicos', medico._id, medico.img);
  }


  // Busqueda de medicos
  buscar(): void {
    if (!this.busqueda || this.busqueda === '') {
      this.cargarMedicos();
      return;
    }

    this.busquedasService.buscar('medicos', this.busqueda)
      .subscribe( resultados => {
        this.medicos = resultados;
      });
  }


}
