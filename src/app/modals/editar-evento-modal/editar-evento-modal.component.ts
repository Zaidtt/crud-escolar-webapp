import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventosService } from 'src/app/services/eventos.service';
import { EliminarUserModalComponent } from '../eliminar-user-modal/eliminar-user-modal.component';

@Component({
  selector: 'app-editar-evento-modal',
  templateUrl: './editar-evento-modal.component.html',
  styleUrls: ['./editar-evento-modal.component.scss']
})
export class EditarEventoModalComponent implements OnInit{

  constructor(
    private eventosService: EventosService,
    private dialogRef: MatDialogRef<EditarEventoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void{

  }

  public cerrar_modal(){
    this.dialogRef.close({isDelete:false});
  }

  public editarEvento() {
  this.eventosService.actualizarEvento(this.data).subscribe({
    next: () => {
      alert('Evento actualizado correctamente');
      this.dialogRef.close('actualizado');
    },
    error: (err) => {
      alert('Error al actualizar el evento');
      console.error(err);
    }
  });
}



}
