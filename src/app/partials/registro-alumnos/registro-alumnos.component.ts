import { Component, Input, OnInit } from '@angular/core';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
declare var $: any;

@Component({
  selector: 'app-registro-alumnos',
  templateUrl: './registro-alumnos.component.html',
  styleUrls: ['./registro-alumnos.component.scss'],
})
export class RegistroAlumnosComponent implements OnInit {
  @Input() rol: string = '';
  @Input() datos_user: any = {};

  public alumno: any = {};
  public errors: any = {};
  public editar: boolean = false;
  public token: string = '';
  public idUser: Number = 0;

  //Para contraseñas
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  constructor(
    private location: Location,
    private alumnosService: AlumnosService,
    private router: Router,
    private facadeService: FacadeService,
    private activatedRoute: ActivatedRoute

  ) {}

  ngOnInit(): void {

    //El primer if valida si existe un parametro en la URL
    if(this.activatedRoute.snapshot.params['id'] != undefined){
      this.editar = true;
      //Asignamos a nuestra variable global el valor del ID que viene por la URL
      this.idUser = this.activatedRoute.snapshot.params['id'];
      console.log("ID User: ", this.idUser);
      //Al iniciar la vista asignamos los datod del user
      this.alumno = this.datos_user;
    }else{
      this.alumno = this.alumnosService.esquemaAlumnos();
      this.alumno.rol = this.rol;
      this.token = this.facadeService.getSessionToken();
    }
    //Imprimir datos en la consola
    console.log("Admin: ", this.alumno);
  }

  // Funciones para mostrar u ocultar la contraseña
  showPassword() {
    if (this.inputType_1 == 'password') {
      this.inputType_1 = 'text';
      this.hide_1 = true;
    } else {
      this.inputType_1 = 'password';
      this.hide_1 = false;
    }
  }
  showPwdConfirmar() {
    if (this.inputType_2 == 'password') {
      this.inputType_2 = 'text';
      this.hide_2 = true;
    } else {
      this.inputType_2 = 'password';
      this.hide_2 = false;
    }
  }
  public regresar() {
    this.location.back();
  }
  public registrar() {
    //Validación del formulario
    this.errors = [];

    this.errors = this.alumnosService.validarAlumno(this.alumno, this.editar);
    if (!$.isEmptyObject(this.errors)) {
      return false;
    }
    //Validar la contraseña
    if (this.alumno.password == this.alumno.confirmar_password) {
      //Aquí se va a ejecutar la lógica de programación para registrar un usuario
      this.alumnosService.registrarAlumno(this.alumno).subscribe(
        (response) => {
          //Aquí va la ejecución del servicio si todo es correcto
          alert('Usuario registrado correctamente');
          console.log('Usuario registrado: ', response);
          if (this.token != '') {
            this.router.navigate(['home']);
          } else {
            this.router.navigate(['/']);
          }
        },
        (error) => {
          //Aquí se ejecuta el error
          alert('No se pudo registrar usuario');
        }
      );
    } else {
      alert('Las contraseñas no coinciden');
      this.alumno.password = '';
      this.alumno.confirmar_password = '';
    }
  }

  public actualizar() {
    //Validación
    this.errors = [];

    this.errors = this.alumnosService.validarAlumno(this.alumno, this.editar);
    if (!$.isEmptyObject(this.errors)) {
      return false;
    }
    console.log('Pasó la validación');

    this.alumnosService.editarAlumno(this.alumno).subscribe(
      (response) => {
        alert('Alumno editado correctamente');
        console.log('Alumno editado: ', response);
        //Si se editó, entonces mandar al home
        this.router.navigate(['home']);
      },
      (error) => {
        alert('No se pudo editar el alumno');
      }
    );
  }

  // Función para detectar el cambio de fecha
  public changeFecha(event: any) {
    console.log(event);
    console.log(event.value.toISOString());

    this.alumno.fecha_nacimiento = event.value.toISOString().split('T')[0];
    console.log('Fecha: ', this.alumno.fecha_nacimiento);
  }

  public soloLetras(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    // Permitir solo letras (mayusculas y minusculas) y espacio
    if (
      !(charCode >= 65 && charCode <= 90) && // letras mayusculas
      !(charCode >= 97 && charCode <= 122) && // letras minusculas
      charCode !== 32 // espacio
    ) {
      event.preventDefault();
    }
  }
}
