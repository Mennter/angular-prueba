import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditorPersonaComponent } from './componentes/editor-persona/editor-persona.component';
import { ListaPersonaComponent } from './componentes/lista-persona/lista-persona.component';

const routes: Routes = [
  {
    path: '',
    component: ListaPersonaComponent
  },
  {
    path: 'nuevo',
    component: EditorPersonaComponent
  },
  {
    path: ':id',
    component: EditorPersonaComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
