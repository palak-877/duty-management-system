import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { projectData } from '../../../core/services/project-data';
import { officerData } from '../../../core/services/officer-data';
import { designationData } from '../../../core/services/designation-data';
import { employeeData } from '../../../core/services/employee-data';

@Component({
  selector: 'app-assign-duty',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assign-duty.html',
  styleUrl: './assign-duty.css'
})
export class AssignDuty {

  projects = projectData.projects;

  officers = officerData.officers;

  designations = designationData.designations;

  employees = employeeData.employees;

  selectedProject = '';

  selectedOfficer: any = null;

  requiredStaff: any[] = [];

  recommendedEmployees: any[] = [];

  onProjectChange() {

    this.selectedOfficer = this.officers.find(
      officer => officer.project === this.selectedProject
    );

    this.requiredStaff = [];

    this.recommendedEmployees = [];

    const projectRoles = this.designations.filter(
      designation => designation.project === this.selectedProject
    );

    projectRoles.forEach(role => {

      this.requiredStaff.push({

        role: role.role,

        count: 0

      });

    });

  }

  recommendEmployees() {

    this.recommendedEmployees = [];

    if (!this.selectedOfficer) {

      alert('Please select a project.');

      return;

    }

    this.requiredStaff.forEach(staff => {

      const matchingEmployees = this.employees.filter(emp =>

        emp.designation === staff.role &&

        emp.constituency === this.selectedOfficer.constituency &&

        !emp.isAssigned

      );

      const selectedEmployees = matchingEmployees.slice(
        0,
        Number(staff.count)
      );

      this.recommendedEmployees.push(...selectedEmployees);

    });

    if (this.recommendedEmployees.length === 0) {

      alert('No suitable employees found.');

    }

  }

  assignDuty() {

    if (this.recommendedEmployees.length === 0) {

      alert('Please recommend employees first.');

      return;

    }

    this.recommendedEmployees.forEach(emp => {

      emp.isAssigned = true;

    });

    alert(
      `${this.recommendedEmployees.length} employee(s) assigned successfully.`
    );

  }

}