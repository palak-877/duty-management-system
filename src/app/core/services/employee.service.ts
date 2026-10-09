import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Employee {
  _id?: string;

  distcode?: number;
  rno?: number;
  class?: number;

  Name: string;
  FName?: string;
  rAddress?: string;

  HomeCons?: number;
  cons?: number;

  PayScaleCode?: number;
  basicPay?: number;

  office?: string;
  category?: string;

  DesigCode?: number;
  excercisedElectionDuty?: string;

  longLeave?: string;
  handicap?: string;
  DOR?: string;
  BLO?: string;

  id: string;
  sex?: string;
  del?: string;

  dt?: number;

  deptcode?: string;
  officecode?: string;

  PartyNo?: number;
  cons_alot?: number;
  StateCentre?: string;
  sendreceivedist?: number;

  oldrno?: number;
  newpartyno?: number;

  selected?: string;
  nativecon?: number;

  letterno?: number;
  centrecode?: number;

  mobileno?: string;

  dob?: number;
  retiredt?: number;

  deptslno?: number;

  exportdata?: string;
  lotno?: number;

  RegdVoterCons?: number;
  rocode?: number;

  __v?: number;
  createdAt?: string;
  updatedAt?: string;
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