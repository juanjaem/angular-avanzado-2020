import { Component, OnDestroy } from '@angular/core';
import { Observable, interval, observable, Subscription } from 'rxjs';
import { retry, take, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnDestroy{

  public intervalSubs: Subscription;

  constructor() {

    // Ejemplo 1 Observables ====================
    // this.retornaObservable().pipe( retry(1) )
    //   .subscribe( (valor) => {
    //     console.log('Subs: ', valor);
    //   }, (error) => {
    //     console.warn('Error: ', error);
    //   }, () => {
    //     console.log('Obs terminado');
    //   }
    // );
    // ========================================

    // Ejemplo 2 Observables ====================
    this.intervalSubs = this.retornaIntervalo().subscribe( (valor) => {
        console.log(valor);
      }, (error) => {
        console.warn('Error: ', error);
      }, () => {
        console.log('Complete');
      }
    );
    // ========================================
  }


  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
  }

  // Ejemplo 2 Observables ====================
  retornaIntervalo(): Observable<number> {
    return interval(500).pipe(
      map(valor => {
        return valor + 1;
      }),
      filter( valor => (valor % 2 === 0) ? true : false), // True = par; false = impar
      take(10), // Al la cuarta llamada del observable lanza el complete
    );
  }


  // Ejemplo 1 Observables ====================
  retornaObservable(): Observable<number> {
    let i = -1;

    return new Observable<number>( observer => {

      const intervalo = setInterval( () => {

        i++;
        observer.next(i);
        if (i === 4) {
          clearInterval(intervalo);
          observer.complete();
        }

        if (i === 2) {
          observer.error('Llegó al valor de 2'); // Lanzar un error de ejemplo
        }
      }, 1000);

    });
  }


}
