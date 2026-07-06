import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { dutyData } from '../../../core/services/duty-data';

@Component({
  selector: 'app-assign-duty',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assign-duty.html',
  styleUrl: './assign-duty.css'
})
export class AssignDuty {

  selectedDepartment: string = '';

  employees = dutyData.employees;

  get filteredEmployees() {
    if (!this.selectedDepartment) {
      return this.employees;
    }
    return this.employees.filter(
      emp => emp.department === this.selectedDepartment
    );
  }

  toggleSelection(emp: any) {
    emp.selected = !emp.selected;
  }

  assignDuty() {
    let selectedCount = 0;

    this.employees.forEach(emp => {
      if (emp.selected) {
        emp.status = 'Assigned';
        emp.selected = false;
        selectedCount++;
      }
    });

    alert(`${selectedCount} Employee(s) Assigned Successfully`);
  }
}