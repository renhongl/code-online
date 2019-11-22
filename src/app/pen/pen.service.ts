import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PenService {

  constructor(private http: HttpClient) { }

  searchPath(word: string) {
    return this.http.get('https://api.cdnjs.com/libraries?search=' + word + '&fields=description');
  }
}
