import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  EmployeeService,
  Employee
} from '../../../core/services/employee.service';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './employees.html',
  styleUrl: './employees.css'
})
export class Employees implements OnInit {

  employees: Employee[] = [];

  searchText = '';

  currentPage = 1;
  pageSize = 20;

  totalEmployees = 0;
  totalPages = 0;

  loading = false;
  errorMessage = '';

  constructor(
    private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {

    this.loading = true;
    this.errorMessage = '';

    this.employeeService
      .getEmployees(
        this.currentPage,
        this.pageSize,
        this.searchText
      )
      .subscribe({
        next: (response) => {

          this.employees = response.data;

          this.totalEmployees =
            response.pagination.total;

          this.totalPages =
            response.pagination.totalPages;

          this.loading = false;

          // Make sure the table updates immediately
          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Failed to load employees:',
            error
          );

          this.errorMessage =
            'Unable to load employees from server.';

          this.loading = false;

          this.cdr.detectChanges();
        }
      });
  }

  searchEmployees(): void {
    this.currentPage = 1;
    this.loadEmployees();
  }

  previousPage(): void {

    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadEmployees();
    }
  }

  nextPage(): void {

    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadEmployees();
    }
  }

  getStartRecord(): number {

    if (this.totalEmployees === 0) {
      return 0;
    }

    return (
      (this.currentPage - 1) *
      this.pageSize
    ) + 1;
  }

  getEndRecord(): number {

    return Math.min(
      this.currentPage * this.pageSize,
      this.totalEmployees
    );
  }

  get availableCount(): number {
  return 0;
}

get assignedCount(): number {
  return 0;
}
}