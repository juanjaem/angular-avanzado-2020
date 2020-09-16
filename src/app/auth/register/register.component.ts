import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  public formSubmitted: boolean = false; // Flag para saber si se ha intentado alguna vez el submit

  public registerForm = this.fb.group({
    nombre: ['Juan', Validators.required],
    email: ['test100@gmail.com', [Validators.required, Validators.email]],
    password: ['123456', Validators.required],
    password2: ['123456', Validators.required],
    terminos: [false]
  }, {
    validators: [
      this.passwordsIguales('password', 'password2'),
      this.checkTerminos()
    ],
  });


  // SUBMIT
  crearUsuario(): void {
    this.formSubmitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.usuarioService.crearUsuario(this.registerForm.value)
      .subscribe( (resp) => {
        this.router.navigateByUrl('/');
      }, (err) => {
        Swal.fire('Error', err.error.msg, 'error');
      });
  }


  campoNoValido(campo: string): boolean {
    if ( this.registerForm.get(campo).invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }
  }


  contrasenasNoValidas(): boolean {
    const pass1 = this.registerForm.get('password').value;
    const pass2 = this.registerForm.get('password2').value;

    if (pass1 !== pass2 && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }


  aceptaTerminos(): boolean {
    return !this.registerForm.get('terminos').value && this.formSubmitted;
  }


  // Validador personalizado: valida que las 2 contraseñas sean iguales
  passwordsIguales(pass1Name: string, pass2Name: string): ValidatorFn {
    return (formControl: AbstractControl): {[key: string]: any} | null => {
      const pass1Control = formControl.get(pass1Name);
      const pass2Control = formControl.get(pass2Name);

      if ( pass1Control.value === pass2Control.value ) {
        return null;
      } else {
        pass2Control.setErrors({ noEsIgual: true });
      }
    };
  }


  // Validador personalizado: valida que el checkbox de términos esté activado
  checkTerminos(): ValidatorFn {
    return (formControl: AbstractControl): {[key: string]: any} | null => {
      const terminosControl = formControl.get('terminos');

      if ( terminosControl.value === true) {
        return null;
      } else {
        terminosControl.setErrors({ terminosNoAceptados: true });
      }
    };
  }


}
