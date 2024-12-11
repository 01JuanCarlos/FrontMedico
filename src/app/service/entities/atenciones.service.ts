import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AtencionesService {

  apiURL = 'http://localhost:9099/api/app/';

  constructor(private http: HttpClient) {
    
   }

   

}
