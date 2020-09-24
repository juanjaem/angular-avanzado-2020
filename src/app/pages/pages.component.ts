import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { ModalImagenComponent } from '../components/modal-imagen/modal-imagen.component';
import { SidebarService } from '../services/sidebar.service';

// Declaramos esta función global para que no salten errores de Typescript
declare function customInitFunctions(): void;

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent implements OnInit {

  constructor(
    private settingsService: SettingsService,
    private sidebarService: SidebarService
    ) { }

  ngOnInit(): void {
    customInitFunctions(); // Inicializar los plugins. Necesario hacer cada vez que iniciamos sesión despues de un logout
    this.sidebarService.cargarMenu();
  }

}
