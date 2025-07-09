import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReceiverService {
  private baseUrl = 'https://localhost:7216/api/Receiver'; // API Gateway base URL

  constructor(private http: HttpClient) {}

  recordReceive(receiver: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/AddReceiver`, receiver);
  }

  getAllReceivers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/GetAllReceivers`);
  }

  getReceiverById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetReceiverById/${id}`);
  }

  updateReceiver(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/UpdateReceiver/${id}`, data);
  }

  deleteReceiver(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/DeleteReceiver/${id}`);
  }
}
