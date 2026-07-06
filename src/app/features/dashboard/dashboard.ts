import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { dutyData } from '../../core/services/duty-data';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  employees = dutyData.employees;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(() => {
      this.employees = dutyData.employees;
    });
  }

  get totalEmployees() {
    return this.employees.length;
  }

  get assigned() {
    return this.employees.filter(e => e.status === 'Assigned').length;
  }

  get unassigned() {
    return this.employees.filter(e => e.status === 'Unassigned').length;
  }
}