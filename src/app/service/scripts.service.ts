import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScriptsService {

  constructor() { }

  cargar(archivos: string[]): Promise<void> {
    return archivos.reduce((promise, archivo) => {
      return promise.then(() => {
        return new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = './assets/js/' + archivo + '.js';
          script.onload = () => {
            console.log(`${archivo} cargado correctamente`);
            resolve();
          };
          script.onerror = () => {
            console.error(`Error al cargar el script ${archivo}`);
            reject();
          };
          document.body.appendChild(script);
        });
      });
    }, Promise.resolve());
  }
  

  img_verificacion() {
    setTimeout(function timeout() {
      $('#img-chek').hide(); // Este código solo funcionará si jQuery está correctamente cargado
    }, 2000);
  }
}
