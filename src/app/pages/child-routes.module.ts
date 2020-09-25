import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// GUARDS
import { AdminGuard } from '../guards/admin.guard';

// PAGES
import { DashboardComponent } from './dashboard/dashboard.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { ProgressComponent } from './progress/progress.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { PerfilComponent } from './perfil/perfil.component';
import { BusquedaComponent } from './busqueda/busqueda.component';

// MANTENIMIENTOS
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
import { HospitalesComponent } from './mantenimientos/hospitales/hospitales.component';
import { MedicosComponent } from './mantenimientos/medicos/medicos.component';
import { MedicoComponent } from './mantenimientos/medicos/medico.component';


// MÓDULO PARA CARGA LAZY LOAD
const childRoutes: Routes = [
  { path: '', component: DashboardComponent, data: {titulo: 'Dashboard'} },
  { path: 'account-settings', component: AccountSettingsComponent, data: {titulo: 'Ajustes de cuenta'} },
  { path: 'buscar/:termino', component: BusquedaComponent, data: {titulo: 'Busquedas'} },
  { path: 'grafica1', component: Grafica1Component, data: {titulo: 'Grafica'} },
  { path: 'perfil', component: PerfilComponent, data: {titulo: 'Perfil del usuario'} },
  { path: 'progress', component: ProgressComponent, data: {titulo: 'Progress'} },
  { path: 'promesas', component: PromesasComponent, data: {titulo: 'Promesas'} },
  { path: 'rxjs', component: RxjsComponent, data: {titulo: 'RxJs'} },

  // Mantenimientos
  { path: 'hospitales', component: HospitalesComponent, data: {titulo: 'Mantenimiento de hospitales'} },
  { path: 'medicos', component: MedicosComponent, data: {titulo: 'Mantenimiento de medicos'} },
  { path: 'medico/:id', component: MedicoComponent, data: {titulo: 'Admin. medico'} },

  // Rutas admin
  { path: 'usuarios', canActivate: [AdminGuard], component: UsuariosComponent, data: {titulo: 'Mantenimiento de usuarios'} },
];


@NgModule({
  imports: [RouterModule.forChild(childRoutes)],
  exports: [RouterModule]
})
export class ChildRoutesModule { }
