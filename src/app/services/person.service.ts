import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  private baseUrl = 'https://localhost:7216/api/Person';

  constructor(private http: HttpClient) {}

  getAllPersons(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/GetAllPersons`);
  }

  getPersonById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetPersonById/${id}`);
  }

  getPersonByName(name: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/GetPersonByName/${name}`);
  }

  getPersonByBloodGroup(bloodGroup: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/GetPersonByBloodGroup/${bloodGroup}`
    );
  }

  addPerson(person: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/AddPerson`, person);
  }

  updatePerson(id: number, person: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/UpdatePerson/${id}`, person);
  }

  deletePerson(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/DeletePerson/${id}`);
  }
}
