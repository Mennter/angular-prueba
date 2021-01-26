import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './../servicios/config.service';
import { Injectable } from '@angular/core';
import { Persona } from '../dominio/persona';


@Injectable({
  providedIn: 'root'
})
export class PersonaRepository {

  constructor(
    private configService: ConfigService,
    private httpClient: HttpClient
  ) { }

  private url = this.configService.baseURL + 'persona';


  public getAll(): Observable<Persona[]> {
    return this.httpClient.get<Persona[]>(this.url);
  }

  public getOneById(id: number): Observable<Persona> {
    return this.httpClient.get<Persona>(`${this.url}/${id}`);
  }

  public save(persona: Persona): Observable<Persona>  {
    return this.httpClient.post<Persona>(`${this.url}`, persona)
  }

  public delete(id: number): Observable<Persona>  {
    return this.httpClient.delete<Persona>(`${this.url}/${id}`)
  }

}
