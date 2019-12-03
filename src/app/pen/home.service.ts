import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  getPens(filter: string) {
    return this.http.get('/code-online/assets/data/pens.json');
  }
}
