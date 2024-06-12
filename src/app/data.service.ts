import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:8000/api/data'; // URL of the backend API
  constructor(private http: HttpClient) { }
  getData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
