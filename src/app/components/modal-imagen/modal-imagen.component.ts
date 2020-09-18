import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalImagenService } from '../../services/modal-imagen.service';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

  @ViewChild('input1')input1: ElementRef;

  public imagenSubir: File;
  public imgTemp: any = null; // Para mostrar vista previa

  constructor(
    public modalImagenService: ModalImagenService,
    public fileUploadService: FileUploadService
    ) { }

  ngOnInit(): void {
  }

  cerrarModal(): void {
    this.imgTemp = null;
    this.imagenSubir = null;
    this.input1.nativeElement.value = '';
    this.modalImagenService.cerrarModal();
  }


  cambiarImagen(file: File): void {
    this.imagenSubir = file;

    if ( !file ) {
      this.imgTemp = null;
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL( file );

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    };
  }


  subirImagen(): void {
    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    this.fileUploadService
      .actualizarFoto(this.imagenSubir, tipo, id)
      .then( img => {
        if (img !== '') {
          Swal.fire('Guardado', 'Imagen actualizada', 'success');
          this.modalImagenService.nuevaImagen.emit(img);
          this.cerrarModal();
        }
      }).catch( err => {
        console.log(err);
        Swal.fire('Error', 'No se pudo actualizar la imagen', 'error');
      });
  }

}
