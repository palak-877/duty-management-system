import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { projectData } from '../../../core/services/project-data';
import { officerData } from '../../../core/services/officer-data';
import { designationData } from '../../../core/services/designation-data';
import { employeeData } from '../../../core/services/employee-data';
import { dutyEligibilityData } from '../../../core/services/duty-eligibility-data';
import { Auth } from '../../../core/services/auth';
@Component({
  selector: 'app-assign-duty',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assign-duty.html',
  styleUrl: './assign-duty.css'
})
export class AssignDuty implements OnInit {

  // =======================
  // Master Data
  // =======================

  projects = projectData.projects;
  officers = officerData.officers;
  dutyRoles = designationData.designations;
  employees = employeeData.employees;
  eligibilityRules = dutyEligibilityData;
  // =======================
  // Step Control
  // =======================

  currentStep = 1;

  // =======================
  // Form Data
  // =======================

  selectedProject: number = 0;

  selectedOfficer: any = null;

  assignmentMethod = 'manual';

  requiredStaff: any[] = [];

  recommendedEmployees: any[] = [];

  eligibleEmployees: any[] = [];

  availabilityMessages: string[] = [];

  warningMessage = '';

  loggedInUser: any = null;

  isAdmin = false;

  selectedOfficerId: number | null = null;

  selectedDepartment = '';

selectedOffice = '';

selectedDesignation = '';

searchText = '';

  constructor(
  private auth: Auth
) {}


  ngOnInit() {

  this.loggedInUser = this.auth.getLoggedInUser();

  if (!this.loggedInUser) {

    this.warningMessage =
      'No user is logged in.';

    return;

  }

  this.isAdmin = this.loggedInUser.role === 'Admin';

  if (!this.isAdmin) {

    this.loadLoggedInOfficer();

  }

}

getProjectName(projectId: number): string {

  const project = this.projects.find(
    p => p.id === projectId
  );

  return project ? project.name : '';

}
  // =======================
  // Project Selection
  // =======================

  onProjectChange() {

    if (this.isAdmin) {

  this.selectedOfficer = null;

  this.selectedOfficerId = null;

}

  this.requiredStaff = [];

  this.eligibleEmployees = [];

  this.warningMessage = '';

  const selectedProject = this.projects.find(

    project => project.id === Number(this.selectedProject)

  );

  if (!selectedProject) {

    return;

  }

  // Admin chooses officer manually
  if (this.isAdmin && this.selectedOfficerId) {

    this.selectedOfficer = this.officers.find(

      officer => officer.id === this.selectedOfficerId

    );

  }

  const projectRoles = this.dutyRoles.filter(

    role => role.projectId === selectedProject.id

  );

  projectRoles.forEach(role => {

    this.requiredStaff.push({

      dutyRole: role.dutyRole,

      count: 0

    });

  });

}

  // =======================
  // Navigation
  // =======================

  nextStep() {

  if (this.currentStep !== 1) {

    this.currentStep++;

    return;

  }

  if (!this.selectedProject) {

    alert('Please select a project.');

    return;

  }

  if (this.isAdmin && !this.selectedOfficer) {

  alert('Please select an officer.');

  return;

}

  let totalEmployees = 0;

  for (const staff of this.requiredStaff) {

    staff.count = Number(staff.count);

    if (staff.count < 0) {

      alert('Employee count cannot be negative.');

      return;

    }

    if (!Number.isInteger(staff.count)) {

      alert('Please enter whole numbers only.');

      return;

    }

    totalEmployees += staff.count;

  }

  if (totalEmployees === 0) {

    alert('Please enter the required number of employees for at least one duty role.');

    return;

  }

  this.currentStep++;

}

  previousStep() {

    if (this.currentStep > 1) {

      this.currentStep--;

    }

  }

  generateEmployees() {

    this.employees.forEach(emp => {

  emp.selected = false;

});

  if (this.assignmentMethod === 'manual') {

    this.generateManualEmployees();

  } else {

    this.generateRecommendedEmployees();

  }

}

generateManualEmployees() {

  this.eligibleEmployees = [];
  this.availabilityMessages = [];

  this.requiredStaff.forEach(staff => {

    const rule = this.eligibilityRules.find(

  r =>

    r.projectId === Number(this.selectedProject) &&

    r.dutyRole === staff.dutyRole

);
    if (!rule) {

      return;

    }

    const employees = this.employees.filter(emp =>

  rule.eligibleDesignations.includes(emp.designation) &&

  !emp.isAssigned

);

const shuffledEmployees = this.shuffleEmployees(employees);

const selectedEmployees = shuffledEmployees.slice(
  0,
  Number(staff.count)
);

if (selectedEmployees.length < Number(staff.count)) {

  this.availabilityMessages.push(

    `${staff.dutyRole}: Required ${staff.count}, Available ${selectedEmployees.length}`

  );

}

this.eligibleEmployees.push({

  dutyRole: staff.dutyRole,

  required: staff.count,

  employees: selectedEmployees

});

  });

  if (this.availabilityMessages.length > 0) {

  this.warningMessage =
    'Some requested employees are unavailable.\n\n' +
    this.availabilityMessages.join('\n') +
    '\n\nOnly the available employees have been displayed.';

} else {

  this.warningMessage = '';

}

}

generateRecommendedEmployees() {


  if (!this.selectedOfficer) {

  alert('Please select an officer.');

  return;

}

  this.eligibleEmployees = [];
  this.availabilityMessages = [];

  this.requiredStaff.forEach(staff => {

    const rule = this.eligibilityRules.find(

  r =>

    r.projectId === Number(this.selectedProject) &&

    r.dutyRole === staff.dutyRole

);

    if (!rule) {

      return;

    }

    const employees = this.employees.filter(emp =>

  rule.eligibleDesignations.includes(emp.designation) &&

  emp.constituency === this.selectedOfficer.constituency &&

  !emp.isAssigned

);

const shuffledEmployees = this.shuffleEmployees(employees);

const recommended = shuffledEmployees.slice(
  0,
  Number(staff.count)
);

if (recommended.length < Number(staff.count)) {

  this.availabilityMessages.push(

    `${staff.dutyRole}: Required ${staff.count}, Available ${recommended.length}`

  );

}

recommended.forEach(emp => {

  emp.selected = false;

  emp.recommended = true;

});

this.eligibleEmployees.push({

  dutyRole: staff.dutyRole,

  required: staff.count,

  employees: recommended

});

  });

  if (this.availabilityMessages.length > 0) {

  this.warningMessage =
    'Some requested employees are unavailable.\n\n' +
    this.availabilityMessages.join('\n') +
    '\n\nOnly the available employees have been displayed.';

} else {

  this.warningMessage = '';

}

}

shuffleEmployees(employees: any[]) {

  const shuffled = [...employees];

  for (let i = shuffled.length - 1; i > 0; i--) {

    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];

  }

  return shuffled;

}

assignDuties() {

  let assignedCount = 0;

  this.eligibleEmployees.forEach(group => {

    group.employees.forEach((emp: any) => {

      if (emp.selected) {

        emp.isAssigned = true;

        emp.selected = false;

        assignedCount++;

      }

    });

  });

  if (assignedCount === 0) {

    alert('Please select at least one employee.');

    return;

  }

  alert(`${assignedCount} employee(s) assigned successfully.`);

  this.currentStep = 1;

this.selectedProject = 0;

this.requiredStaff = [];

this.eligibleEmployees = [];

this.assignmentMethod = 'manual';

this.warningMessage = '';

this.availabilityMessages = [];

if (this.isAdmin) {

  this.selectedOfficer = null;

  this.selectedOfficerId = null;

} else {

  this.loadLoggedInOfficer();

}

}

onOfficerChange() {

  this.selectedOfficer = this.officers.find(

    officer => officer.id === Number(this.selectedOfficerId)

  );

}

loadLoggedInOfficer() {

  const userId = this.auth.getLoggedInUserId();

  this.selectedOfficer = this.officers.find(

    officer => officer.userId === userId

  );

  if (!this.selectedOfficer) {

    this.warningMessage =
`⚠ No officer found for the logged-in account.

Please contact the administrator.`;

  }

}


/* ================= Filters ================= */

getDepartments() {

  return [...new Set(this.employees.map(e => e.department))];

}

getOffices() {

  return [...new Set(this.employees.map(e => e.office))];

}

getDesignations() {

  return [...new Set(this.employees.map(e => e.designation))];

}

filterEmployees(group: any) {

  return group.employees.filter((emp: any) => {

    const departmentMatch =
      !this.selectedDepartment ||
      emp.department === this.selectedDepartment;

    const officeMatch =
      !this.selectedOffice ||
      emp.office === this.selectedOffice;

    const designationMatch =
      !this.selectedDesignation ||
      emp.designation === this.selectedDesignation;

    const searchMatch =
      !this.searchText ||
      emp.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      emp.employeeCode.toLowerCase().includes(this.searchText.toLowerCase());

    return (
      departmentMatch &&
      officeMatch &&
      designationMatch &&
      searchMatch
    );

  });

}

resetFilters() {

  this.selectedDepartment = '';

  this.selectedOffice = '';

  this.selectedDesignation = '';

  this.searchText = '';

}


/* ================= Selected Employees Count ================= */

getSelectedCount(): number {

  let count = 0;

  this.eligibleEmployees.forEach(group => {

    group.employees.forEach((emp: any) => {

      if (emp.selected) {

        count++;

      }

    });

  });

  return count;

}

}

