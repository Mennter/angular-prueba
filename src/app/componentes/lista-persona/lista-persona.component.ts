import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Persona } from 'src/app/dominio/persona';
import { PersonaRepository } from 'src/app/repositorios/persona.repository';
import { InformacionComponent } from '../informacion/informacion.component';

@Component({
  selector: 'app-lista-persona',
  templateUrl: './lista-persona.component.html',
  styleUrls: ['./lista-persona.component.css']
})
export class ListaPersonaComponent implements OnInit, OnDestroy {

  public personas: Persona[] = []

  public personasDataSource;


  public columnas: string[] = ['codigo','nombre','direccion','poblacion','codigoPostal','ciudad','telefono','email', 'borrar'];

  private diccionarioSubs: { [key: string]: Subscription } = {};

  constructor(
    private personaRepository: PersonaRepository,
    private router: Router,
    private matSnackBar: MatSnackBar,
    private dialog: MatDialog
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
    this.getAllPersonas();
  }

  getAllPersonas() {
     this.diccionarioSubs.getAll = this.personaRepository.getAll().subscribe(
      {
        next: (personas: Persona[]) => {
          this.personas = personas;
          this.personasDataSource = new MatTableDataSource(personas);
        },
        error: () => {
          this.matSnackBar.open("Ocurrio un error al obtener la lista", "OK", {
            duration: 2000,
          });
        }
      }
    )
  }

  onClickRow(persona: Persona) {
    this.router.navigate(['/', persona.id])
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.personasDataSource.filter = filterValue.trim().toLowerCase();
  }

  onClickBorrar(event, persona: Persona) {
    event.stopPropagation();
    this.diccionarioSubs.delete = this.personaRepository.delete(persona.id).subscribe(
      {
        next: () => {
          this.matSnackBar.open("Se borro correctamente", "OK", {
            duration: 2000,
          });

          this.getAllPersonas();
        },
        error: () => {
          this.matSnackBar.open("Ocurrio un error al borrar el elemento", "OK", {
            duration: 2000,
          });
        }
      }
    )
  }

  onClickAdd() {
    this.router.navigate(['/nuevo'])
  }

  onClickInformacion() {
    this.dialog.open(InformacionComponent);
  }
}
