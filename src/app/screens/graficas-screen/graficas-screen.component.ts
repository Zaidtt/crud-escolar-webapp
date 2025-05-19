import { Component, OnInit } from '@angular/core';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { EventosService } from 'src/app/services/eventos.service';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-graficas-screen',
  templateUrl: './graficas-screen.component.html',
  styleUrls: ['./graficas-screen.component.scss']
})
export class GraficasScreenComponent implements OnInit {
  public total_user: any = {};
  public totalEventos: number = 0;

  // Gráfica de línea (hora por fecha)
  lineChartData: any = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Hora de Inicio de Eventos',
        backgroundColor: '#F88406',
        borderColor: '#F88406',
        fill: false,
        tension: 0.4
      }
    ]
  };
  lineChartOption: ChartOptions<'line'> = {
  responsive: true,
  scales: {
    y: {
      min: 0,
      max: 24,
      ticks: {
        callback: function (value: number | string) {
          const v = typeof value === 'string' ? parseFloat(value) : value;
          const h = Math.floor(v);
          const m = Math.round((v - h) * 60);
          return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        }
      },
      title: {
        display: true,
        text: 'Hora de Inicio'
      }
    },
    x: {
      title: {
        display: true,
        text: 'Fecha del Evento'
      }
    }
  }
};

  lineChartPlugins = [DatalabelsPlugin];

  // Gráfica de barras - Eventos por tipo
  barChartData: any = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Eventos por Tipo',
        backgroundColor: ['#F88406', '#FCFF44', '#82D3FB', '#2AD84A']
      }
    ]
  };
  barChartOption = { responsive: true };
  barChartPlugins = [DatalabelsPlugin];

  // Gráficas circulares (usuarios)
  pieChartData = {
    labels: ["Administradores", "Maestros", "Alumnos"],
    datasets: [
      {
        data: [0, 0, 0],
        label: 'Registro de usuarios',
        backgroundColor: ['#FCFF44', '#F1C8F2', '#31E731']
      }
    ]
  };
  pieChartOption = { responsive: false };
  pieChartPlugins = [DatalabelsPlugin];

  doughnutChartData = {
    labels: ["Administradores", "Maestros", "Alumnos"],
    datasets: [
      {
        data: [0, 0, 0],
        label: 'Registro de usuarios',
        backgroundColor: ['#F88406', '#FCFF44', '#31E7E7']
      }
    ]
  };
  doughnutChartOption = { responsive: false };
  doughnutChartPlugins = [DatalabelsPlugin];

  constructor(
    private administradoresServices: AdministradoresService,
    private eventosService: EventosService
  ) {}

  ngOnInit(): void {
    this.obtenerTotalUsers();
    this.obtenerTotalEventos();
  }

  public obtenerTotalUsers() {
    this.administradoresServices.getTotalUsuarios().subscribe(
      (response) => {
        this.total_user = response;
        const admin = this.total_user.admins || 0;
        const maestros = this.total_user.maestros || 0;
        const alumnos = this.total_user.alumnos || 0;

        this.pieChartData.datasets[0].data = [admin, maestros, alumnos];
        this.doughnutChartData.datasets[0].data = [admin, maestros, alumnos];

        this.pieChartData = { ...this.pieChartData };
        this.doughnutChartData = { ...this.doughnutChartData };
      },
      (error) => {
        alert("No se pudo obtener el total de cada rol de usuarios");
      }
    );
  }

  public obtenerTotalEventos() {
    this.eventosService.obtenerListaEventos().subscribe({
      next: (lista: any[]) => {
        const etiquetasFecha: string[] = [];
        const valoresHoraDecimal: number[] = [];

        const conteoTipos: any = {
          'Conferencia': 0,
          'Taller': 0,
          'Seminario': 0,
          'Concurso': 0
        };

        lista.forEach(evento => {
          // Línea: fecha y hora
          const fecha = new Date(evento.fecha_realizacion);
          const etiquetaX = fecha.toLocaleDateString();
          etiquetasFecha.push(etiquetaX);

          const horaStr = evento.horaInicio || '00:00';
          const [horas, minutos] = horaStr.split(':').map(Number);
          const horaDecimal = horas + (minutos / 60);
          valoresHoraDecimal.push(horaDecimal);

          // Barras: por tipo
          const tipo = evento.tipo_evento || 'Otro';
          conteoTipos[tipo] = (conteoTipos[tipo] || 0) + 1;
        });

        // Setear datos
        this.lineChartData.labels = etiquetasFecha;
        this.lineChartData.datasets[0].data = valoresHoraDecimal;
        this.lineChartData = { ...this.lineChartData };

        this.barChartData.labels = Object.keys(conteoTipos);
        this.barChartData.datasets[0].data = Object.values(conteoTipos);
        this.barChartData = { ...this.barChartData };
      },
      error: (err) => {
        alert('Error al obtener eventos');
        console.error(err);
      }
    });
  }
}
