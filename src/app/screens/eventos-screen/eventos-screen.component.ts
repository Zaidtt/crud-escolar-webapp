import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EliminarEventoModalComponent } from 'src/app/modals/eliminar-evento-modal/eliminar-evento-modal.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { EventosService } from 'src/app/services/eventos.service';
import { FacadeService } from 'src/app/services/facade.service';

@Component({
  selector: 'app-eventos-screen',
  templateUrl: './eventos-screen.component.html',
  styleUrls: ['./eventos-screen.component.scss'],
})
export class EventosScreenComponent implements OnInit {
  public lista_eventos: any[] = [];
  public rol: string = '';

  displayedColumns: string[] = [];

  dataSource = new MatTableDataSource<DatosEventos>(
    this.lista_eventos as DatosEventos[]
  );
  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private eventosService: EventosService,
    private facadeService: FacadeService
  ) {}
  ngOnInit(): void {
    // Obtener el rol del usuario
    this.rol = this.facadeService.getUserGroup(); // <-- Ajusta según tu implementación

    // Definir columnas según el rol
    if (this.rol === 'administrador') {
      this.displayedColumns = [
        'nombreEv',
        'tipo_evento',
        'fecha_realizacion',
        'horaInicio',
        'horaFin',
        'lugar',
        'publico_json',
        'responsable',
        'programa_educativo',
        'descripcion_breve',
        'cupo',
        'editar',
        'eliminar',
      ];
    } else {
      this.displayedColumns = [
        'nombreEv',
        'tipo_evento',
        'fecha_realizacion',
        'horaInicio',
        'horaFin',
        'lugar',
        'publico_json',
        'responsable',
        'programa_educativo',
        'descripcion_breve',
        'cupo',
      ];
    }
    //Obtener eventos
    this.obtenerEventos();

    //Para paginator
    this.initPaginator();
  }

 public goEditar(idEvento: number) {
  this.router.navigate(['registro-eventos', idEvento]);
}

  public delete(idEvento: number) {
    const dialogRef = this.dialog.open(EliminarEventoModalComponent, {
      data: { id: idEvento }, //Se pasan valores a través del componente
      height: '288px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.isDelete) {
        console.log('Evento eliminado');
        //Recarga pagina
        window.location.reload();
      } else {
        alert('Evento no eliminado');
        console.log('No se eliminó el evento');
      }
    });
  }

  public initPaginator() {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      //console.log("Paginator: ", this.dataSourceIngresos.paginator);
      //Modificar etiquetas del paginador a español
      this.paginator._intl.itemsPerPageLabel = 'Registros por página';
      this.paginator._intl.getRangeLabel = (
        page: number,
        pageSize: number,
        length: number
      ) => {
        if (length === 0 || pageSize === 0) {
          return `0 / ${length}`;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex =
          startIndex < length
            ? Math.min(startIndex + pageSize, length)
            : startIndex + pageSize;
        return `${startIndex + 1} - ${endIndex} de ${length}`;
      };
      this.paginator._intl.firstPageLabel = 'Primera página';
      this.paginator._intl.lastPageLabel = 'Última página';
      this.paginator._intl.previousPageLabel = 'Página anterior';
      this.paginator._intl.nextPageLabel = 'Página siguiente';
    }, 500);
    //this.dataSourceIngresos.paginator = this.paginator;
  }
  /*
  public obtenerEventos() {
    this.eventosService.obtenerListaEventos().subscribe(
      (response) => {
        this.lista_eventos = response;
        console.log('Lista eventos: ', this.lista_eventos);
        if (this.lista_eventos.length > 0) {
          //Agregar datos del nombre e email
          this.lista_eventos.forEach((eventoss) => {
            eventoss.nombreEv = eventoss.nombreEv;
            eventoss.tipo_evento = eventoss.tipo_evento;
          });
          console.log('Eventos: ', this.lista_eventos);

          this.dataSource = new MatTableDataSource<DatosEventos>(
            this.lista_eventos as DatosEventos[]
          );
        }
      },
      (error) => {
        alert('No se pudo obtener la lista de eventos');
      }
    );
  }*/

    obtenerEventos() {
    this.eventosService.obtenerListaEventos().subscribe(
      (eventos) => {
        if (this.rol === 'maestro') {
          this.lista_eventos = eventos.filter(e =>
            e.publico_json.includes('Profesores') || e.publico_json.includes('Público General')
          );
        } else if (this.rol === 'alumno') {
          this.lista_eventos = eventos.filter(e =>
            e.publico_json.includes('Estudiantes') || e.publico_json.includes('Público General')
          );
        } else {
          // Administrador ve todos
          this.lista_eventos = eventos;
        }

        this.dataSource.data = this.lista_eventos;
      },
      (error) => {
        alert('No se pudo obtener la lista de eventos');
      }
    );
  }
}


export interface DatosEventos {
  nombreEv: string;
  tipo_evento: number;
  fecha_realizacion: string;
  horaInicio: string;
  horaFin: string;
  lugar: string;
  publico_json: string[];
  responsable: number;
  programa_educativo: number;
  descripcion_breve: string;
  cupo: number;
}
