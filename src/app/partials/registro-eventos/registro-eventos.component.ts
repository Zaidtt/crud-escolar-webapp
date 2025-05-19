import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { EventosService } from '../../services/eventos.service';
import { Router } from '@angular/router';
import { ErrorsService } from 'src/app/services/tools/errors.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EditarEventoModalComponent } from 'src/app/modals/editar-evento-modal/editar-evento-modal.component';



declare var $: any;

@Component({
  selector: 'app-registro-eventos',
  templateUrl: './registro-eventos.component.html',
  styleUrls: ['./registro-eventos.component.scss'],
})
export class RegistroEventosComponent implements OnInit {
  public minDate: Date = new Date();
  public evento: any = {};
  public errors: any = {};
  hora: string = '';
  public editar: boolean = false;
  public publico_json: any[] = [];

  public responsables: any[] = [];

  public eventos: any[] = [
    { value: '1', viewValue: 'Conferencia' },
    { value: '2', viewValue: 'Taller' },
    { value: '3', viewValue: 'Seminario' },
    { value: '4', viewValue: 'Concurso' },
  ];

  public publico: any[] = [
    { value: '1', nombre: 'Estudiantes' },
    { value: '2', nombre: 'Profesores' },
    { value: '3', nombre: 'Público General' },
  ];
  public programas: any[] = [
    { value: '1', viewValues: 'Ingeniería en Ciencias de la Computación' },
    { value: '2', viewValues: 'Licenciatura en Ciencias de la Computación' },
    { value: '3', viewValues: 'Ingeniería en Tecnologías de la Información' },
  ];

  constructor(
    private eventosService: EventosService,
    private location: Location,
    private router: Router,
    public errorService: ErrorsService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.editar = true;
        this.cargarEvento(id);
      }
    });


    if (!this.evento.publico_json) {
      this.evento.publico_json = [];
    }

  // Obtener maestros
  this.eventosService.obtenerListaMaestros().subscribe((maestros) => {
    // Si la respuesta es un array directo:
    const maestrosConRol = maestros.map((m: any) => ({ ...m, rol: 'Maestro' }));
    this.responsables = this.responsables.concat(maestrosConRol);
  });

  // Obtener administradores
  this.eventosService.obtenerListaAdmins().subscribe((admins) => {
    const adminsConRol = admins.map((a: any) => ({ ...a, rol: 'Administrador' }));
    this.responsables = this.responsables.concat(adminsConRol);
  });
  }

    cargarEvento(id: string) {
  this.eventosService.obtenerEventoPorId(id).subscribe({
    next: (evento) => {
      const normalizarHora = (hora: any): string => {
        if (typeof hora === 'string') return hora.slice(0, 5); // "12:00:00" -> "12:00"
        if (hora instanceof Date) {
          const h = hora.getHours().toString().padStart(2, '0');
          const m = hora.getMinutes().toString().padStart(2, '0');
          return `${h}:${m}`;
        }
        return '00:00';
      };

      this.evento = evento;

      this.evento.horaInicio = normalizarHora(evento.horaInicio);
      this.evento.horaFin = normalizarHora(evento.horaFin);

      if (evento.fecha_realizacion && evento.fecha_realizacion.includes('T')) {
        this.evento.fecha_realizacion = new Date(evento.fecha_realizacion).toISOString().split('T')[0];
      }

      this.evento.responsable = evento.responsable_id;

      console.log("Evento cargado:", this.evento);
    },
    error: (err) => {
      console.error("Error al cargar evento:", err);
    }
  });
}





  // Función para detectar el cambio de fecha
  public changeFecha(event: any) {
    if (event && event.value) {
      this.evento.fecha_realizacion = event.value.toISOString().split('T')[0];
      console.log('Fecha: ', this.evento.fecha_realizacion);
    } else {
      this.evento.fecha_realizacion = null;
      console.log('Fecha no seleccionada');
    }
  }
  public validarHoras(): boolean {
    if (!this.evento.horaInicio || !this.evento.horaFin) return true;
    // Convierte a formato 24h si es necesario
    return this.evento.horaInicio < this.evento.horaFin;
  }

  public soloAlfanumericoEspacio(event: KeyboardEvent) {
    const char = event.key;
    // Permite letras, números y espacio
    if (!/^[a-zA-Z0-9 ]$/.test(char)) {
      event.preventDefault();
    }
  }

  public revisarSeleccion(nombre: string) {
    if (this.evento.publico_json) {
      var busqueda = this.evento.publico_json.find(
        (element) => element == nombre
      );
      if (busqueda != undefined) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  public checkboxChange(event: any) {
    if (!this.evento.publico_json) {
      this.evento.publico_json = [];
    }
    if (event.checked) {
      this.evento.publico_json.push(event.source.value);
    } else {
      this.evento.publico_json = this.evento.publico_json.filter(
        (item: string) => item !== event.source.value
      );
    }
  }
  /*
public checkboxChange(event: any) {
  console.log("Evento: ", event);
  if (event.checked) {
    this.evento.publico_json.push(event.source.value);
  }
  else {
    console.log(event.source.value);
    this.evento.publico_json.forEach((eve, i) => {
      if (eve == event.source.value) {
        this.evento.publico_json.splice(i, 1);
      }
    });
  }
  console.log("Array eventos: ", this.evento);
}
  */

  public descripcionBasica(event: KeyboardEvent) {
    const char = event.key;
    if (!/^[a-zA-Z0-9 .,;:!?"'()\-\n]$/.test(char)) {
      event.preventDefault();
    }
  }
  public regresar() {
    this.location.back();
  }
  public registrar() {
    if (!this.validarHoras()) {
      this.errors.horaFin = 'La hora de finalización debe ser mayor a la hora de inicio';
      return;
    }
    this.errors = this.eventosService.validarEvento(this.evento, this.editar);

    if (Object.keys(this.errors).length > 0) {
      return;
    }

    // Convertir horas a formato 24h antes de enviar al backend
    this.evento.horaInicio = this.convertirHoraA24h(this.evento.horaInicio);
    this.evento.horaFin = this.convertirHoraA24h(this.evento.horaFin);

    this.eventosService.registrarEvento(this.evento).subscribe({
      next: (resp) => {
        alert('Evento registrado correctamente');
        this.router.navigate(['/eventos']);
      },
      error: (err) => {
        alert(this.eventosService.errorService.generic);
        console.error(err);
      },
    });
  }
  private convertirHoraA24h(hora: string): string {
    if (!hora) return '';
    // Si ya está en formato 24h
    if (/^\d{2}:\d{2}$/.test(hora)) return hora;
    // Si viene como "6:00 AM" o "6:00 PM"
    const [time, modifier] = hora.split(' ');
    let [hours, minutes] = time.split(':');
    hours = hours.padStart(2, '0');
    if (modifier === 'PM' && hours !== '12') {
      hours = String(parseInt(hours, 10) + 12);
    }
    if (modifier === 'AM' && hours === '12') {
      hours = '00';
    }
    return `${hours}:${minutes}`;
  }

    public actualizar() {
  if (!this.validarHoras()) {
    this.errors.horaFin = 'La hora de finalización debe ser mayor a la hora de inicio';
    return;
  }

  this.errors = this.eventosService.validarEvento(this.evento, this.editar);
  if (Object.keys(this.errors).length > 0) {
    return;
  }

    // Abrir el modal de confirmación
    const dialogRef = this.dialog.open(EditarEventoModalComponent, {
        width: '500px',
        data: {
          ...this.evento,
          titulo: 'Editar Evento',
          mensaje: 'Estás a punto de editar este evento y se generarán los cambios'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 'actualizado') {
          this.router.navigate(['/eventos']);
        }
      });
    }


  public mostrarProgramaEducativo(): boolean {
    return (
      this.evento.publico_json &&
      (this.evento.publico_json.includes('Estudiantes') ||
        this.evento.publico_json.includes('Profesores'))
    );
  }

}
