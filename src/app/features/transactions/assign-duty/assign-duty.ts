

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

  // ==========================
  // Master Data
  // ==========================

  projects = projectData.projects;
  officers = officerData.officers;
  dutyRoles = designationData.designations;
  employees = employeeData.employees;
  eligibilityRules = dutyEligibilityData;

  // ==========================
  // Page Variables
  // ==========================

  currentStep = 1;

  selectedProject = 0;
  selectedOfficer: any = null;
  selectedOfficerId: number | null = null;

  assignmentMethod = 'manual';

  requiredStaff: any[] = [];
  currentEmployees: any[] = [];

  availabilityMessages: string[] = [];
  warningMessage = '';

  loggedInUser: any = null;
  isAdmin = false;

  currentRoleIndex = 0;


allocatedEmployeeIds: number[] = [];

finalAssignments: any[] = [];

joiningStage = false;
joiningEmployees: any[] = [];

  // ==========================
  // Filters
  // ==========================

  selectedDepartment = '';
  selectedOffice = '';
  selectedDesignation = '';
  searchText = '';

  selectAll = false;

  rejectionReasons = [
    'Already Assigned',
    'Medical Leave',
    'Out of Station',
    'Election Duty',
    'Personal Reason',
    'Training',
    'Other'
  ];

  // ==========================
  // Batch Management
  // ==========================

  currentLot = 1;
  generatedLots: any[] = [];

  constructor(
    private auth: Auth
  ) { }

  ngOnInit(): void {

    this.loggedInUser = this.auth.getLoggedInUser();

    if (!this.loggedInUser) {

      this.warningMessage = 'No user is logged in.';
      return;

    }

    this.isAdmin = this.loggedInUser.role === 'Admin';

    if (!this.isAdmin) {

      this.loadLoggedInOfficer();

    }

  }

    // ==========================
  // Project Helper
  // ==========================

  getProjectName(projectId: number): string {

    const project = this.projects.find(
      p => p.id === projectId
    );

    return project ? project.name : '';

  }

  // ==========================
  // Project Selection
  // ==========================

  onProjectChange(): void {

    if (this.isAdmin) {

      this.selectedOfficer = null;
      this.selectedOfficerId = null;

    }

    this.requiredStaff = [];
    this.currentEmployees = [];
    this.warningMessage = '';

    const selectedProject = this.projects.find(
      project => project.id === Number(this.selectedProject)
    );

    if (!selectedProject) {

      return;

    }

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

  // ==========================
  // Navigation
  // ==========================

  nextStep(): void {

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

      alert('Please enter at least one required employee.');
      return;

    }

    this.currentStep++;

  }

  previousStep(): void {

    if (this.currentStep > 1) {

      this.currentStep--;

    }

  }

    // ==========================
  // Generate Employees
  // ==========================

  generateEmployees(): void {

    this.employees.forEach((emp: any) => {
      emp.selected = false;
    });

    if (this.assignmentMethod === 'manual') {

      this.generateManualEmployees();

    } else {

      this.generateRecommendedEmployees();

    }

  }

  // ==========================
  // Manual Assignment
  // ==========================

generateManualEmployees(): void {

  this.currentEmployees = [];
  this.availabilityMessages = [];

  this.requiredStaff.forEach((staff: any, index: number) => {

    const rule = this.eligibilityRules.find(
      (r: any) =>
        r.projectId === Number(this.selectedProject) &&
        r.dutyRole === staff.dutyRole
    );

    if (!rule) {
      return;
    }

    // Show only the current role
    if (index !== this.currentRoleIndex) {
      return;
    }

    const eligibleEmployees = this.employees.filter((emp: any) =>

      rule.eligibleDesignations.includes(emp.designation) &&
      !emp.isAssigned &&
      !this.allocatedEmployeeIds.includes(emp.id)

    );

    if (eligibleEmployees.length < Number(staff.count)) {

      this.availabilityMessages.push(
        `${staff.dutyRole}: Required ${staff.count}, Available ${eligibleEmployees.length}`
      );

    }

    const allEmployees = this.employees.filter((emp: any) =>

      !this.allocatedEmployeeIds.includes(emp.id)

    );

    allEmployees.forEach((emp: any) => {

      emp.selected = false;
      emp.recommended = false;
      emp.rejectReason = '';
      emp.otherReason = '';

    });

    this.currentEmployees.push({

      dutyRole: staff.dutyRole,

      required: staff.count,

      employees: allEmployees

    });

  });

  if (this.availabilityMessages.length > 0) {

    this.warningMessage =
      'Some requested employees are unavailable.\n\n' +
      this.availabilityMessages.join('\n');

  } else {

    this.warningMessage = '';

  }

}

    // ==========================
  // Recommended Assignment
  // ==========================

generateRecommendedEmployees(): void {

  if (!this.selectedOfficer) {

    alert('Please select an officer.');
    return;

  }

  this.currentEmployees = [];
  this.availabilityMessages = [];

  this.requiredStaff.forEach((staff: any, index: number) => {

    const rule = this.eligibilityRules.find(
      (r: any) =>
        r.projectId === Number(this.selectedProject) &&
        r.dutyRole === staff.dutyRole
    );

    if (!rule) {
      return;
    }

    // Show only current duty role
    if (index !== this.currentRoleIndex) {
      return;
    }

    const eligibleEmployees = this.employees.filter((emp: any) =>

      rule.eligibleDesignations.includes(emp.designation) &&
      emp.constituency === this.selectedOfficer.constituency &&
      !emp.isAssigned &&
      !this.allocatedEmployeeIds.includes(emp.id)

    );

    const shuffledEmployees = this.shuffleEmployees(eligibleEmployees);

    const recommendedEmployees = shuffledEmployees.slice(
      0,
      Number(staff.count)
    );

    if (recommendedEmployees.length < Number(staff.count)) {

      this.availabilityMessages.push(
        `${staff.dutyRole}: Required ${staff.count}, Available ${recommendedEmployees.length}`
      );

    }

    const allEmployees = this.employees.filter(
      (emp: any) => !this.allocatedEmployeeIds.includes(emp.id)
    );

    allEmployees.forEach((emp: any) => {

      emp.selected = false;
      emp.recommended = false;
      emp.rejectReason = '';
      emp.otherReason = '';

    });

    recommendedEmployees.forEach((emp: any) => {

      emp.recommended = true;

    });

    const remainingEmployees = allEmployees.filter(
      (emp: any) => !recommendedEmployees.includes(emp)
    );

    this.currentEmployees.push({

      dutyRole: staff.dutyRole,

      required: staff.count,

      employees: [
        ...recommendedEmployees,
        ...remainingEmployees
      ]

    });

  });

  if (this.availabilityMessages.length > 0) {

    this.warningMessage =
      'Some requested employees are unavailable.\n\n' +
      this.availabilityMessages.join('\n');

  } else {

    this.warningMessage = '';

  }

}
  // ==========================
  // Utility
  // ==========================

  shuffleEmployees(employees: any[]): any[] {

    const shuffled = [...employees];

    for (let i = shuffled.length - 1; i > 0; i--) {

      const j = Math.floor(Math.random() * (i + 1));

      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];

    }

    return shuffled;

  }

    // ==========================
  // Assign Duties
  // ==========================

 assignDuties(): void {

  if (this.joiningStage) {

  this.saveJoiningStatus();
  return;

}

  let selectedEmployees = this.currentEmployees[0].employees.filter(
    (emp: any) => emp.selected
  );

  const required = this.requiredStaff[this.currentRoleIndex].count;

if (selectedEmployees.length !== required) {

  alert(
    `Please select exactly ${required} employee(s) for ${this.requiredStaff[this.currentRoleIndex].dutyRole}.`
  );

  return;

}

  if (selectedEmployees.length === 0) {

    alert('Please select at least one employee.');
    return;

  }

  // Save selected employees for current role
  selectedEmployees.forEach((emp: any) => {

  if (emp.isAssigned) {

    return;

  }

  emp.selected = false;

  this.allocatedEmployeeIds.push(emp.id);

  this.finalAssignments.push({

    employee: emp,
    dutyRole: this.requiredStaff[this.currentRoleIndex].dutyRole

  });

});

  // Next duty role
  if (this.currentRoleIndex < this.requiredStaff.length - 1) {

    this.currentRoleIndex++;

    if (this.assignmentMethod === 'manual') {

      this.generateManualEmployees();

    } else {

      this.generateRecommendedEmployees();

    }

    return;

  }

  // Final Assignment
this.generateBatchNumbers();

this.finalAssignments.forEach((assignment: any) => {

  assignment.employee.isAssigned = true;
  assignment.employee.joined = false;
  assignment.employee.joinReason = '';
  assignment.employee.otherReason = '';

});

this.joiningEmployees = [

  {

    dutyRole: 'Assigned Employees',

    required: this.finalAssignments.length,

    employees: this.finalAssignments.map(
      (a: any) => a.employee
    )

  }

];

this.joiningStage = true;

// Clear old selections
this.currentEmployees.forEach((group: any) => {

  group.employees.forEach((emp: any) => {

    emp.selected = false;

  });

});


}

  // ==========================
  // Officer
  // ==========================

  onOfficerChange(): void {

    this.selectedOfficer = this.officers.find(

      officer => officer.id === Number(this.selectedOfficerId)

    );

  }

  loadLoggedInOfficer(): void {

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

  // ==========================
  // Filters
  // ==========================

  getDepartments() {

    return [...new Set(this.employees.map((e: any) => e.department))];

  }

  getOffices() {

    return [...new Set(this.employees.map((e: any) => e.office))];

  }

  getDesignations() {

    return [...new Set(this.employees.map((e: any) => e.designation))];

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

  resetFilters(): void {

    this.selectedDepartment = '';
    this.selectedOffice = '';
    this.selectedDesignation = '';
    this.searchText = '';

  }

    // ==========================
  // Select All
  // ==========================

  toggleSelectAll(): void {

    this.currentEmployees.forEach((group: any) => {

      group.employees.forEach((emp: any) => {

        if (!emp.isAssigned) {

          emp.selected = this.selectAll;

        }

      });

    });

  }

  // ==========================
  // Individual Selection
  // ==========================

 toggleEmployeeSelection(emp: any): void {

  const limit = this.requiredStaff[this.currentRoleIndex].count;

  let selected = 0;
  let total = 0;

  this.currentEmployees.forEach((group: any) => {

    group.employees.forEach((employee: any) => {

      if (!employee.isAssigned) {

        total++;

        if (employee.selected) {

          selected++;

        }

      }

    });

  });

  // Prevent selecting more than required
  if (selected > limit) {

    emp.selected = false;

    alert(`Only ${limit} employee(s) can be selected for ${this.requiredStaff[this.currentRoleIndex].dutyRole}.`);

    return;

  }

  this.selectAll = total > 0 && total === selected;

}

  // ==========================
  // Batch Number Generation
  // ==========================

  generateBatchNumbers(): void {

    let employeeNumber = 1;

    this.currentEmployees.forEach((group: any) => {

      group.employees.forEach((emp: any) => {

        if (emp.selected) {

          emp.batchNumber =
            `LOT${this.currentLot}-${employeeNumber
              .toString()
              .padStart(3, '0')}`;

          employeeNumber++;

        }

      });

    });

  }

  // ==========================
  // Selected Count
  // ==========================

  getSelectedCount(): number {

    let count = 0;

    this.currentEmployees.forEach((group: any) => {

      group.employees.forEach((emp: any) => {

        if (emp.selected) {

          count++;

        }

      });

    });

    return count;

  }

  saveJoiningStatus(): void {

  for (const emp of this.joiningEmployees[0].employees) {


    if (!emp.joined && !emp.joinReason) {

      alert(`Please mark "${emp.name}" as Joined or select a reason.`);

      return;

    }

  }

  this.generatedLots.push({

    lotNumber: this.currentLot,

    employees: JSON.parse(JSON.stringify(this.finalAssignments))

  });

  this.currentLot++;

  alert('Batch completed successfully.');

  this.currentStep = 1;

  this.selectedProject = 0;

  this.requiredStaff = [];

  this.currentEmployees = [];

  this.joiningEmployees = [];

  this.currentRoleIndex = 0;

  this.allocatedEmployeeIds = [];

  this.finalAssignments = [];

  this.assignmentMethod = 'manual';

  this.warningMessage = '';

  this.availabilityMessages = [];

  this.joiningStage = false;

  if (this.isAdmin) {

    this.selectedOfficer = null;

    this.selectedOfficerId = null;

  } else {

    this.loadLoggedInOfficer();

  }

}

}