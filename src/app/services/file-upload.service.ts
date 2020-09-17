import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {



  constructor() { }


  // Actualiza la foto de perfil de usuarios, médicos y hospitales
  async actualizarFoto(
    archivo: File,
    tipo: 'usuarios' | 'medicos' | 'hospitales',
    id: string
  ): Promise<string> {


    try {
      const url = `${ base_url}/upload/${ tipo }/${ id }`;
      const formData = new FormData();
      formData.append('imagen', archivo);

      // Fetch es un metodo propio de JS para hacer peticiones. Lo usamos en vez de la libreria HTTP de angular para aprender alternativas
      const resp = await fetch( url, {
        method: 'PUT',
        headers: {
          'x-token': localStorage.getItem('token') || ''
        },
        body: formData
      });


      const data = await resp.json(); // La info de la respuesta tarda un poco en estar disponible. Si no esperamos con un await,
                                      // se obtendrá un 'redableStream' en 'resp'

      if (data.ok) {
        return data.nombreArchivo;
      } else {
        console.log(data.msg);
        return '';
      }

    } catch (error) {
      console.log(error);
      return '';
    }
  }


}
