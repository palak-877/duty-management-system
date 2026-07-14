import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { projectData } from '../../core/services/project-data';
import { designationData } from '../../core/services/designation-data';
import { employeeData } from '../../core/services/employee-data';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  projects = projectData.projects;

  designations = designationData.designations;

  employees = employeeData.employees;

  loggedInUser: any = null;

  // This will be connected later when we build Assign Duty
  totalAssignments = 0;

  constructor(private auth: Auth) {}

  ngOnInit() {

    this.loggedInUser = this.auth.getLoggedInUser();

  }

  get totalProjects() {

    return this.projects.length;

  }

  get totalDesignations() {

    return this.designations.length;

  }

  get totalEmployees() {

    return this.employees.length;

  }

}