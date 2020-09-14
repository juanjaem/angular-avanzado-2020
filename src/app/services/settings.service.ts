import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private themeConfigElem: Element = document.querySelector('#theme'); // Se encuentra en el index. Por eso lo accedemos así con vanillaJS
  public optionsElem: NodeListOf<Element>;

  constructor() {
    // Iniciar el Theme
    const url = localStorage.getItem('theme') || './assets/css/colors/blue.css';
    this.themeConfigElem.setAttribute('href', url);
  }


  // Cambia el tema
  changeTheme(theme: string): void {
    // El tema se cambiará eligiendo el archivo correspondiente de css en el index
    const url = `./assets/css/colors/${theme}.css`;
    this.themeConfigElem.setAttribute('href', url);
    localStorage.setItem('theme', url);

    this.checkCurrentTheme();
  }


  // Para añadir la clase del check a las cajas (No usamos ngClass porque esto es más eficiente que poner 8 ngClass)
  checkCurrentTheme(): void {

    this.optionsElem.forEach(elem => {
      elem.classList.remove('working');
      const btnTheme = elem.getAttribute('data-theme');
      const btnThemeUrl = `./assets/css/colors/${btnTheme}.css`;
      const currentThemeUrl = this.themeConfigElem.getAttribute('href');
      if (btnThemeUrl === currentThemeUrl) {
        elem.classList.add('working');
      }
    });
  }


}
