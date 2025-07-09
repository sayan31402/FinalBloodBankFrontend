import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'https://localhost:7190/gateway/Auth'; // Use the API Gateway URL

  constructor(private http: HttpClient) {}

  login(userName: string, password: string): Observable<any> {
    // The backend expects { userName, password } (case-sensitive)
    const data = { UserName: userName, Password: password };
    return this.http.post(`${this.baseUrl}/Login`, data);
  }

  isLoggedIn(): boolean {
    // Check if the user is logged in by verifying the presence of a token
    return !!localStorage.getItem('token');
  }

  getUserRole(): string | null {
    const role = localStorage.getItem('role');
    return role ? role.toLowerCase() : null;
  }
}
