import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'https://localhost:7190/gateway/Auth';

  constructor(private http: HttpClient) { }

  addUser(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Registration`, user);
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`https://localhost:7285/api/User/GetAllUsers`);
  }
}
