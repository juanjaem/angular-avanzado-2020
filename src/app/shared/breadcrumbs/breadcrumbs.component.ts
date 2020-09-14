import { Component, OnDestroy } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})

export class BreadcrumbsComponent implements OnDestroy {

  public titulo: string = '';
  public tituloSubs$: Subscription;

  constructor(private router: Router) {
    // NOTA: También podriamos haber obtenido título con la opcion del ActivatedRouter.snapshot.children[0].data
    // pero como lo hemos hecho está bien, y es más educativo. Igualmente me tendria que suscribir a los cambios.

    this.tituloSubs$ = this.getArgumentosRuta()
      .subscribe( ({titulo}) => { // Desestructurando la data
        this.titulo = titulo; // Poner el titulo en el breadcrumbs
        document.title = `AdminPro - ${titulo}`; // Poner el titulo en la cabecera de la pagina
      });
  }


  ngOnDestroy(): void {
    this.tituloSubs$.unsubscribe();
  }


  // Se encarga de obtener el titulo de la página en la que se encuentra, y ponerlo en el breadcrumbs.
  // Ese titulo viene del pages.routing, de la propiedad 'data'
  getArgumentosRuta(): Observable<any> {
    return this.router.events
      .pipe(
        filter( event => event instanceof ActivationEnd ), // De todos los eventos solo nos interesan los de clase ActivationEnd
        filter( (event: ActivationEnd) => event.snapshot.firstChild === null ), // Solo el que tienen firstChild a null
        map( (event: ActivationEnd) => event.snapshot.data ) // De toda la info, solo necesitamos 'data'
      );
  }


}
