import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from 'src/app/dominio/config';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private appConfig: Config;

  constructor(private httpClient: HttpClient) {}

  cargarConfiguracion() {
    return this.httpClient
      .get('/assets/config.json')
      .toPromise()
      .then((data) => {
        this.appConfig = data as Config;
      });
  }

  get baseURL() {
    if (!this.appConfig) {
      throw Error('No hay config');
    }
    return this.appConfig.baseURL;
  }

}
