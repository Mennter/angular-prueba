import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { of, Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Persona } from 'src/app/dominio/persona';
import { PersonaRepository } from 'src/app/repositorios/persona.repository';


@Component({
  selector: 'app-editor-persona',
  templateUrl: './editor-persona.component.html',
  styleUrls: ['./editor-persona.component.css']
})
export class EditorPersonaComponent implements OnInit, OnDestroy {

  public persona: Persona

  public formulario: FormGroup;

  public cargando = false;

  private diccionarioSubs: { [key: string]: Subscription } = {};

  constructor(
    private route: ActivatedRoute,
    private personaRepository: PersonaRepository,
    private fb: FormBuilder,
    private matSnackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnDestroy(): void {
    for (const key in this.diccionarioSubs) {
      if (this.diccionarioSubs.hasOwnProperty(key)) {
        if (this.diccionarioSubs[key]) {
          this.diccionarioSubs[key].unsubscribe();
        }
      }
    }
  }

  ngOnInit() {
    this.cargando = true
    this.diccionarioSubs.getOneById = this.route.params.pipe(
      mergeMap((params) => {
        if (params.id) {
          return this.personaRepository.getOneById(params.id);
        } else {
          return of(new Persona());
        }
      })
    ).subscribe({
      next: (persona: Persona) => {
        this.cargando = false
        this.persona = persona;
        this.crearFormulario(persona);
      },
      error: () => {
        this.cargando = false
      }
    })
  }

  crearFormulario(persona: Persona) {
    this.formulario = this.fb.group({
      codigo: [persona.codigo, [Validators.required, Validators.maxLength(12)]],
      nombre: [persona.nombre, [Validators.required, Validators.maxLength(200)]],
      direccion: [persona.direccion, [Validators.required, Validators.maxLength(200)]],
      poblacion: [persona.poblacion, [Validators.required, Validators.maxLength(100)]],
      codigoPostal: [persona.codigoPostal, [Validators.required, Validators.maxLength(50)]],
      ciudad: [persona.ciudad, [Validators.required, Validators.maxLength(100)]],
      telefono: [persona.telefono, [Validators.required, Validators.maxLength(20), Validators.pattern("^[0-9]*$")]],
      email: [persona.email, [Validators.required, Validators.email, Validators.maxLength(100)]],
    });
  }

  onSubmit() {
    this.cargando = true
    if (this.formulario.valid) {
      const persona = { ...this.formulario.value, ...{id: this.persona.id} } as Persona
      this.diccionarioSubs.save = this.personaRepository.save(persona).subscribe(
        {
          next: (persona: Persona) => {
            this.cargando = false
            this.persona = persona
            this.matSnackBar.open("Se ha guardado la persona correctamente", "OK", {
              duration: 2000,
            });
          },
          error: () => {
            this.cargando = false
            this.matSnackBar.open("Error al guardar la persona, intente nuevamente", "OK", {
              duration: 2000,
            });
          }
        }
      )
    }
  }

  onDelete() {
    this.cargando = true
    this.diccionarioSubs.delete = this.personaRepository.delete(this.persona.id).subscribe(
      {
        next: () => {
          this.cargando = false
          this.matSnackBar.open("Se borro correctamente", "OK", {
            duration: 2000,
          });

          this.router.navigate(['../'])
        },
        error: () => {
          this.cargando = false
          this.matSnackBar.open("Ocurrio un error al borrar el elemento", "OK", {
            duration: 2000,
          });
        }
      }
    )
  }



}
