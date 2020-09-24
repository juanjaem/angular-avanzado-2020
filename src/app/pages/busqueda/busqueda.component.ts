import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [
  ]
})
export class BusquedaComponent implements OnInit {

  public usuarios: Usuario[] = [];
  public medicos: Medico[] = [];
  public hospitales: Hospital[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private busquedasService: BusquedasService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( ({termino}) => {
      this.busqudaGlobal(termino);
    });
  }


  busqudaGlobal(termino: string): void {
    this.busquedasService.busquedaGlobal(termino).subscribe( data => {
      this.usuarios = data.usuarios;
      this.medicos = data.medicos;
      this.hospitales = data.hospitales;
    });
  }

}
