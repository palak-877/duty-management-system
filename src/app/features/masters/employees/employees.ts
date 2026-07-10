import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { employeeData } from '../../../core/services/employee-data';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employees.html',
  styleUrl: './employees.css'
})
export class Employees {

  employees = employeeData.employees;
  searchText = '';

// showModal = false;

// isEditMode = false;

// editingEmployeeId = 0;

// name = '';

// department = 'Education';

// phone = '';

// email = '';

// openModal() {
//   this.showModal = true;
// }

// closeModal() {

//   this.showModal = false;

//   this.name = '';
//   this.department = 'Education';
//   this.phone = '';
//   this.email = '';

//   this.isEditMode = false;
//   this.editingEmployeeId = 0;

// }

filteredEmployees() {

  const search = this.searchText.trim().toLowerCase();

  return this.employees.filter(employee =>

    employee.name.toLowerCase().includes(search) ||

    employee.department.toLowerCase().includes(search) ||

    employee.phone.includes(search) ||

    employee.email.toLowerCase().includes(search)

  );

}

}