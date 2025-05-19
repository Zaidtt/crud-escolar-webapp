import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ErrorsService } from './tools/errors.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ValidatorService } from './tools/validator.service';
import { FacadeService } from './facade.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class EventosService {
  constructor(
    private http: HttpClient,
    public errorService: ErrorsService,
    private validatorService: ValidatorService,
    private facadeService: FacadeService

  ) {}

  registrarEvento(evento: any): Observable<any> {
    return this.http.post<any>(`${environment.url_api}/eventos/`, evento, httpOptions);
  }
    public esquemaEvento() {
    return {
      'nombreEv': '',
      'tipo_evento': '',
      'fecha_realizacion': '',
      'horaInicio': '',
      'horaFin': '',
      'lugar': '',
      'publico_json': [],
      'responsable': '',
      'programa_educativo': '',
      'descripcion_breve': '',
      'cupo': ''
    }
  }

  public validarEvento(data: any, editar: boolean) {
    console.log('Validando Evento... ', data);

    let error: any = {};

    if (!this.validatorService.required(data['nombreEv'])) {
      error['nombreEv'] = this.errorService.required;
    }
    if (!this.validatorService.required(data['tipo_evento'])){
      error['tipo_evento'] = "Debes seleccionar el tipo de evento";
    }
    if (!this.validatorService.required(data['fecha_realizacion'])) {
      error['fecha_realizacion'] = this.errorService.required;
    }
    if (!this.validatorService.required(data['horaInicio'])) {
      error['horaInicio'] = this.errorService.required;
    }
    if (!this.validatorService.required(data['horaFin'])) {
      error['horaFin'] = this.errorService.required;
    }
    if (!this.validatorService.required(data['lugar'])) {
      error['lugar'] = this.errorService.required;
    }
    if (!this.validatorService.required(data['publico_json'])) {
      error['publico_json'] = "Debes seleccionar el público";
    }
    /*if (!this.validatorService.required(data['programa_educativo'])) {
      error['programa_educativo'] = "Debes seleccionar el programa educativo";
    }*/
    if (!this.validatorService.required(data['descripcion_breve'])) {
      error['descripcion_breve'] = this.errorService.required;
    }
    if (!this.validatorService.required(data['cupo'])) {
      error['cupo'] = this.errorService.required;
    } else if (data['cupo'] <= 0) {
      error['cupo'] = 'El cupo debe ser mayor a 0';
    }

    return error;
  }
  public obtenerListaMaestros (): Observable <any>{
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
    return this.http.get<any>(`${environment.url_api}/lista-maestros/`, {headers:headers});
  }

  public obtenerListaAdmins (): Observable <any>{
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
    return this.http.get<any>(`${environment.url_api}/lista-admins/`, {headers:headers});
  }
  public obtenerListaEventos(): Observable<any> {
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
    return this.http.get<any>(`${environment.url_api}/lista-eventos/`, {headers:headers});
  }
  public eliminarEvento(idEvento: number): Observable <any>{
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
    return this.http.delete<any>(`${environment.url_api}/eventos-edit/?id=${idEvento}`,{headers:headers});
  }

  public obtenerEventoPorId(id: number | string): Observable<any> {
  var token = this.facadeService.getSessionToken();
  var headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  });


  return this.http.get<any>(`${environment.url_api}/eventos/?id=${id}`, { headers: headers });
  }

  public actualizarEvento(evento: any): Observable<any> {
  const token = this.facadeService.getSessionToken();
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  });

  return this.http.put<any>(`${environment.url_api}/eventos-edit/`, evento, { headers });
  }


}
