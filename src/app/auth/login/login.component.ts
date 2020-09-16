import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';

declare const gapi: any; // Lo definimos para usarlo, porque viene del archivo de JS de google que pusimos en el index

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  public auth2: any;

  public formSubmitted: boolean = false; // Flag para saber si se ha intentado alguna vez el submit

  public loginForm = this.fb.group({
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: [false]
  });


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private ngZone: NgZone
  ) { }


  ngOnInit(): void {
    this.renderButton(); // Renderizar el botón de google
  }


  // Login normal por formulario
  login(): void {
    this.usuarioService.login(this.loginForm.value)
      .subscribe( resp => {
        if ( this.loginForm.get('remember').value ) {
          localStorage.setItem('email', this.loginForm.get('email').value);
        } else {
          localStorage.removeItem('email');
        }
        this.router.navigateByUrl('/');
      }, err => {
        Swal.fire('Error', err.error.msg, 'error');
      });
  }


  // Renderiza el botón de google
  renderButton(): void {
    gapi.signin2.render('my-signin2', {
      scope: 'profile email',
      width: 240,
      height: 50,
      longtitle: true,
      theme: 'dark'
    });

    this.startApp();
  }


  async startApp(): Promise<void> {
    await this.usuarioService.googleInit();
    this.attachSignin(document.getElementById('my-signin2'));
  }


  attachSignin(element): void {
    this.usuarioService.auth2.attachClickHandler(element, {},
        (googleUser) => {
          const id_token = googleUser.getAuthResponse().id_token;
          this.usuarioService.loginGoogle(id_token).subscribe(resp => {
            this.ngZone.run( () => {
              this.router.navigateByUrl('/');
            });
          });
        }, (error) => {
          alert(JSON.stringify(error, undefined, 2));
        });
  }

}
