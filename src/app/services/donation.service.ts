import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PersonService } from './person.service';

export interface DonationDTO {
  personId: number;
  personBloodGroup: string;
  quantity: number;
  donationDateTime: string;
  rbcCount: number | null;
  wbcCount: number | null;
  plateletCount: number | null;
}

@Injectable({
  providedIn: 'root',
})
export class DonationService {
  private baseUrl = 'https://localhost:7216/api/Donation';

  constructor(private http: HttpClient) {}

  recordDonation(data: DonationDTO): Observable<any> {
    // Record a new donation
    console.log('Recording donation:', data);
    return this.http.post(`https://localhost:7216/api/Donation/AddDonor`, data);
  }

  getAllDonations(): Observable<DonationDTO[]> {
    // Get all donations
    return this.http.get<DonationDTO[]>(`${this.baseUrl}/GetAllDonors`);
  }

  getDonationById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetDonorById/${id}`);
  }

  updateDonation(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/UpdateDonor/${id}`, data);
  }

  deleteDonation(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/DeleteDonor/${id}`);
  }
}
