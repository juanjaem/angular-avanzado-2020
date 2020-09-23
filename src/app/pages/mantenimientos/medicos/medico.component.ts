import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { promise } from 'protractor';
import { delay } from 'rxjs/operators';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  medicoForm: FormGroup;
  hospitales: Hospital[] = [];
  public hospitalSeleccionado: Hospital;
  public medicoSeleccionado: Medico;


  constructor(
    private fb: FormBuilder,
    private hospitalService: HospitalService,
    private medicoService: MedicoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  async ngOnInit(): Promise<void> {
    this.activatedRoute.params.subscribe( ({id}) => this.cargarMedico(id) );

    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required],
    });

    await this.cargarHospitales();

    this.medicoForm.get('hospital').valueChanges.subscribe( hospitalId => {
      this.hospitalSeleccionado = this.hospitales.find(h => h._id === hospitalId);
    });
  }


  cargarMedico(id: string): void {
    if (id === 'nuevo') {
      return; // Se trata de la creación de un nuevo médico
    }

    this.medicoService.cargarMedicoPorId(id).pipe(
      delay(100)
    )
    .subscribe( (medico: Medico) => {
      if (!medico) {
        // El ID de la url ni pertenece a un médico, ni es '/nuevo'. Por tanto, volver a medicos
        this.router.navigateByUrl('/dashboard/medicos');
      }

      this.medicoSeleccionado = medico;

      const { nombre, hospital: {_id} } = medico;
      this.medicoForm.setValue({nombre, hospital: _id}); // Cargar en el formulario los datos del médico
    });
  }


  cargarHospitales(): void {
    this.hospitalService.cargarHospitales().subscribe( (hospitales: Hospital[]) => {
      this.hospitales = hospitales;
    });
  }


  guardarMedico(): any {
    const {nombre} = this.medicoForm.value;

    if (this.medicoSeleccionado) {

      // actualizar
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }
      this.medicoService.actualizarMedico(data).subscribe( resp => {
        Swal.fire('Actualizado', `${nombre} actualizado correctamente`, 'success');
      });

    } else {

      // crear
      this.medicoService.crearMedico( this.medicoForm.value ).subscribe( (resp: Medico) => {
        Swal.fire('Creado', `${nombre} creado correctamente`, 'success');
        this.router.navigateByUrl(`/dashboard/medico/${resp._id}`);
      });

    }

  }

}
