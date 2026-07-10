import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { projectData } from '../../core/services/project-data';
import { designationData } from '../../core/services/designation-data';
import { employeeData } from '../../core/services/employee-data';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

  projects = projectData.projects;

  designations = designationData.designations;

  employees = employeeData.employees;

  // This will be connected later when we build Assign Duty
  totalAssignments = 0;

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