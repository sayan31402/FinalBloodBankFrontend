import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Match backend DTOs
export interface StockCreateDTO {
  bloodGroup: string;
  quantity: number;
}

export interface StockUpdateDTO {
  quantity: number;
}

export interface StockGetDTO {
  bloodGroup: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class StockService {
  private baseUrl = 'https://localhost:7190/gateway/Stock'; // API Gateway base URL

  constructor(private http: HttpClient) {}

  getAllStocks(): Observable<StockGetDTO[]> {
    return this.http.get<StockGetDTO[]>(`${this.baseUrl}/GetAllStocks`);
  }

  getStockByBloodGroup(bloodGroup: string): Observable<StockGetDTO> {
    return this.http.get<StockGetDTO>(
      `${this.baseUrl}/GetStockByBloodGroup/${bloodGroup}`
    );
  }

  createStock(stock: StockCreateDTO): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/CreateStock`, stock);
  }

  updateStock(bloodGroup: string, stock: StockUpdateDTO): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/UpdateStock/${bloodGroup}`,
      stock
    );
  }

  deleteStock(bloodGroup: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/DeleteStock/${bloodGroup}`);
  }
}
