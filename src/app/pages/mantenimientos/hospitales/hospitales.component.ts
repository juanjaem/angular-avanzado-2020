import { Component, OnDestroy, OnInit } from '@angular/core';
import { HospitalService } from '../../../services/hospital.service';
import { delay, map } from 'rxjs/operators';
import { Hospital } from '../../../models/hospital.model';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { Subscription } from 'rxjs';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public cargando: boolean = true;
  public busqueda: string = '';
  private imagenSubs: Subscription;

  constructor(
    private hospitalService: HospitalService,
    private modalImagenService: ModalImagenService,
    private busquedasService: BusquedasService,
  ) { }

  ngOnDestroy(): void {
    this.imagenSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarHospitales();

    // Suscripción para que cuando se actualice la imagen, se haga una nueva petición para obtener el hospital con la img actualizada
    this.imagenSubs = this.modalImagenService.nuevaImagen
    .pipe(delay(100)) // Retardo para dar tiempo a que el servidor procese la img
    .subscribe( img => {
      this.cargarHospitales();
    });
  }


  cargarHospitales(): void {
    this.cargando = false;
    this.hospitalService.cargarHospitales().subscribe(hospitales => {
      this.hospitales = hospitales;
      this.cargando = false;
    });
  }


  guardarCambios(hospital: Hospital): void {
    this.hospitalService.actualizarHospital(hospital._id, hospital.nombre).subscribe(resp => {
      Swal.fire('Actualizado', hospital.nombre, 'success');
    });
  }


  eliminarHospital(hospital: Hospital): void {
    this.hospitalService.borrarHospital(hospital._id).subscribe(resp => {
      this.cargarHospitales();
      Swal.fire('Borrado', hospital.nombre, 'success');
    });
  }


  // Para crear hospitales
  async abrirSweetAlert(): Promise<void> {
    const {value = ''} = await Swal.fire<string>({
      title: 'Crear hospital',
      text: 'ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true
    });

    if (value.trim().length > 0 ) {
      this.hospitalService.crearHospital(value).subscribe((resp: any) => {
        console.log(resp);
        this.hospitales.push(resp.hospital);
      });
    }
  }


  abrirModal(hospital: Hospital): void {
    this.modalImagenService.abrirModal('hospitales', hospital._id, hospital.img);
  }


  // Busqueda de hospitales
  buscar(): void {
    if (!this.busqueda || this.busqueda === '') {
      this.cargarHospitales();
      return;
    }

    this.busquedasService.buscar('hospitales', this.busqueda)
      .subscribe( resultados => {
        this.hospitales = resultados;
      });
  }

}
