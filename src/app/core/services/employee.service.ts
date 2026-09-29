import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Employee {
  employeeCode: string;
  name: string;
  department: string;
  designation: string;
  constituency: string;
  phone: string;
  email: string;
  status: string;
}

export interface EmployeeApiResponse {
  success: boolean;

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  data: any[];
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = 'http://localhost:5000/api/employees';

  constructor(
    private http: HttpClient
  ) {}

  getEmployees(
    page: number = 1,
    limit: number = 20,
    search: string = ''
  ): Observable<EmployeeApiResponse> {

    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit);

    if (search.trim()) {
      params = params.set(
        'search',
        search.trim()
      );
    }

    return this.http.get<EmployeeApiResponse>(
      this.apiUrl,
      { params }
    );
  }
}