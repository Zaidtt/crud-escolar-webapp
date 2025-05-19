import { Component, OnInit } from '@angular/core';
import { EventosService } from '../../services/eventos.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-registro-eventos-screen',
  templateUrl: './registro-eventos-screen.component.html',
  styleUrls: ['./registro-eventos-screen.component.scss']
})
export class RegistroEventosScreenComponent{
/*
  public tipo_evento: string = "";
  public editar: boolean = false;

  public even:any ={};
  public idEvento: number = 0;

  public isEvent:boolean = false;

  constructor(
    private eventosService: EventosService,
    public activatedRoute: ActivatedRoute,
    private location : Location
  ) { }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params['id'] != undefined) {
      this.editar = true;
      this.idEvento = this.activatedRoute.snapshot.params['id'];
      this.obtenerEventoByID();
    } else {
      // Si es registro nuevo
      this.isEvent = true;
      this.even = {}; // O usa this.eventosService.esquemaEvento()
    }
  }

  public obtenerEventoByID(){
    this.eventosService.getEventoByID(this.idEvento).subscribe(
      (response) => {
        this.even = response;
        this.isEvent = true;
      },
      (error) => {
        alert("No se pudieron obtener los datos del evento para editar");
      }
    );
  }


  public regresar(){
    this.location.back();
  }
  */
}
