// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';


// import { projectData } from '../../../core/services/project-data';
// import { officerData } from '../../../core/services/officer-data';
// import { designationData } from '../../../core/services/designation-data';
// import { employeeData } from '../../../core/services/employee-data';
// import { dutyEligibilityData } from '../../../core/services/duty-eligibility-data';
// import { Auth } from '../../../core/services/auth';
// @Component({
//   selector: 'app-assign-duty',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './assign-duty.html',
//   styleUrl: './assign-duty.css'
// })
// export class AssignDuty implements OnInit {

//   // =======================
//   // Master Data
//   // =======================

//   projects = projectData.projects;
//   officers = officerData.officers;
//   dutyRoles = designationData.designations;
//   employees = employeeData.employees;
//   eligibilityRules = dutyEligibilityData;
//   // =======================
//   // Step Control
//   // =======================

//   currentStep = 1;

//   // =======================
//   // Form Data
//   // =======================

//   selectedProject: number = 0;

//   selectedOfficer: any = null;

//   assignmentMethod = 'manual';

//   requiredStaff: any[] = [];

//   recommendedEmployees: any[] = [];

//   eligibleEmployees: any[] = [];

//   availabilityMessages: string[] = [];

//   warningMessage = '';

//   loggedInUser: any = null;

//   isAdmin = false;

//   selectedOfficerId: number | null = null;

//   selectedDepartment = '';

//   selectedOffice = '';

//   selectedDesignation = '';

//   selectAll = false;

// searchText = '';

// rejectionReasons = [
//   'Already Assigned',
//   'Medical Leave',
//   'Out of Station',
//   'Election Duty',
//   'Personal Reason',
//   'Training',
//   'Other'
// ];

// /* ================= Batch Management ================= */

// currentLot = 1;

// generatedLots: any[] = [];
//   constructor(
//   private auth: Auth
// ) {}


//   ngOnInit() {

//   this.loggedInUser = this.auth.getLoggedInUser();

//   if (!this.loggedInUser) {

//     this.warningMessage =
//       'No user is logged in.';

//     return;

//   }

//   this.isAdmin = this.loggedInUser.role === 'Admin';

//   if (!this.isAdmin) {

//     this.loadLoggedInOfficer();

//   }

// }

// getProjectName(projectId: number): string {

//   const project = this.projects.find(
//     p => p.id === projectId
//   );

//   return project ? project.name : '';

// }
//   // =======================
//   // Project Selection
//   // =======================

//   onProjectChange() {

//     if (this.isAdmin) {

//   this.selectedOfficer = null;

//   this.selectedOfficerId = null;

// }

//   this.requiredStaff = [];

//   this.eligibleEmployees = [];

//   this.warningMessage = '';

//   const selectedProject = this.projects.find(

//     project => project.id === Number(this.selectedProject)

//   );

//   if (!selectedProject) {

//     return;

//   }

//   // Admin chooses officer manually
//   if (this.isAdmin && this.selectedOfficerId) {

//     this.selectedOfficer = this.officers.find(

//       officer => officer.id === this.selectedOfficerId

//     );

//   }

//   const projectRoles = this.dutyRoles.filter(

//     role => role.projectId === selectedProject.id

//   );

//   projectRoles.forEach(role => {

//     this.requiredStaff.push({

//       dutyRole: role.dutyRole,

//       count: 0

//     });

//   });

// }

//   // =======================
//   // Navigation
//   // =======================

//   nextStep() {

//   if (this.currentStep !== 1) {

//     this.currentStep++;

//     return;

//   }

//   if (!this.selectedProject) {

//     alert('Please select a project.');

//     return;

//   }

//   if (this.isAdmin && !this.selectedOfficer) {

//   alert('Please select an officer.');

//   return;

// }

//   let totalEmployees = 0;

//   for (const staff of this.requiredStaff) {

//     staff.count = Number(staff.count);

//     if (staff.count < 0) {

//       alert('Employee count cannot be negative.');

//       return;

//     }

//     if (!Number.isInteger(staff.count)) {

//       alert('Please enter whole numbers only.');

//       return;

//     }

//     totalEmployees += staff.count;

//   }

//   if (totalEmployees === 0) {

//     alert('Please enter the required number of employees for at least one duty role.');

//     return;

//   }

//   this.currentStep++;

// }

//   previousStep() {

//     if (this.currentStep > 1) {

//       this.currentStep--;

//     }

//   }

//   generateEmployees() {

//     this.employees.forEach(emp => {

//   emp.selected = false;

// });

//   if (this.assignmentMethod === 'manual') {

//     this.generateManualEmployees();

//   } else {

//     this.generateRecommendedEmployees();

//   }

// }

// generateManualEmployees() {

//   this.eligibleEmployees = [];
//   this.availabilityMessages = [];

//   this.requiredStaff.forEach(staff => {

//     const rule = this.eligibilityRules.find(

//   r =>

//     r.projectId === Number(this.selectedProject) &&

//     r.dutyRole === staff.dutyRole

// );
//     if (!rule) {

//       return;

//     }

//     const employees = this.employees.filter(emp =>

//   rule.eligibleDesignations.includes(emp.designation) &&

//   !emp.isAssigned

// );

// const shuffledEmployees = this.shuffleEmployees(employees);

// const selectedEmployees = shuffledEmployees.slice(
//   0,
//   Number(staff.count)
// );

// selectedEmployees.forEach((emp: any) => {
//   emp.selected = false;
//   emp.recommended = false;
//   emp.rejectReason = '';
//   emp.otherReason = '';
// });

// if (selectedEmployees.length < Number(staff.count)) {

//   this.availabilityMessages.push(
//     `${staff.dutyRole}: Required ${staff.count}, Available ${selectedEmployees.length}`
//   );

// }

// const remainingEmployees = employees.filter(
//   (e: any) => !selectedEmployees.includes(e)
// );

// remainingEmployees.forEach((emp: any) => {
//   emp.selected = false;
//   emp.recommended = false;
//   emp.rejectReason = '';
//   emp.otherReason = '';
// });

// this.eligibleEmployees.push({
//   dutyRole: staff.dutyRole,
//   required: staff.count,
//   employees: [...selectedEmployees, ...remainingEmployees]
// });

// });

// if (this.availabilityMessages.length > 0) {

//   this.warningMessage =
//     'Some requested employees are unavailable.\n\n' +
//     this.availabilityMessages.join('\n') +
//     '\n\nOnly the available employees have been displayed.';

// } else {

//   this.warningMessage = '';

// }

// }

// generateRecommendedEmployees() {

//   if (!this.selectedOfficer) {

//     alert('Please select an officer.');

//     return;

//   }

//   this.eligibleEmployees = [];
//   this.availabilityMessages = [];

//   this.requiredStaff.forEach(staff => {

//     const rule = this.eligibilityRules.find(

//       r =>

//         r.projectId === Number(this.selectedProject) &&

//         r.dutyRole === staff.dutyRole

//     );

//     if (!rule) {

//       return;

//     }

//     const employees = this.employees.filter(emp =>

//   rule.eligibleDesignations.includes(emp.designation) &&

//   emp.constituency === this.selectedOfficer.constituency &&

//   !emp.isAssigned

// );

// const shuffledEmployees = this.shuffleEmployees(employees);

// const recommended = shuffledEmployees.slice(
//   0,
//   Number(staff.count)
// );

// if (recommended.length < Number(staff.count)) {

//   this.availabilityMessages.push(

//     `${staff.dutyRole}: Required ${staff.count}, Available ${recommended.length}`

//   );

// }

// recommended.forEach(emp: any) => {

//   emp.selected = false;

//   emp.recommended = true;

//   emp.rejectReason = '';

//   emp.otherReason = '';

// });

// const remainingEmployees = employees.filter(
//     e => !recommended.includes(e)
// );

// remainingEmployees.forEach(emp: any) => {

//     emp.selected = false;

//     emp.recommended = false;

//     emp.rejectReason = '';

//     emp.otherReason = '';

// });

//   });

//   if (this.availabilityMessages.length > 0) {

//   this.warningMessage =
//     'Some requested employees are unavailable.\n\n' +
//     this.availabilityMessages.join('\n') +
//     '\n\nOnly the available employees have been displayed.';

// } else {

//   this.warningMessage = '';

// }

// }

// shuffleEmployees(employees: any[]) {

//   const shuffled = [...employees];

//   for (let i = shuffled.length - 1; i > 0; i--) {

//     const j = Math.floor(Math.random() * (i + 1));

//     [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];

//   }

//   return shuffled;

// }

// assignDuties() {

//   this.generateBatchNumbers();

//   let assignedCount = 0;

//   this.eligibleEmployees.forEach(group => {

//     group.employees.forEach((emp: any) => {

//       if (emp.selected) {

//         emp.isAssigned = true;

//         emp.selected = false;

//         assignedCount++;

//       }

//     });

//   });

//   if (assignedCount === 0) {

//     alert('Please select at least one employee.');

//     return;

//   }

//   this.generatedLots.push({

//   lotNumber: this.currentLot,

//   employees: this.eligibleEmployees

// });

// this.currentLot++;

//   alert(`${assignedCount} employee(s) assigned successfully.`);

//   this.currentStep = 1;

// this.selectedProject = 0;

// this.requiredStaff = [];

// this.eligibleEmployees = [];

// this.assignmentMethod = 'manual';

// this.warningMessage = '';

// this.availabilityMessages = [];

// if (this.isAdmin) {

//   this.selectedOfficer = null;

//   this.selectedOfficerId = null;

// } else {

//   this.loadLoggedInOfficer();

// }

// }

// onOfficerChange() {

//   this.selectedOfficer = this.officers.find(

//     officer => officer.id === Number(this.selectedOfficerId)

//   );

// }

// loadLoggedInOfficer() {

//   const userId = this.auth.getLoggedInUserId();

//   this.selectedOfficer = this.officers.find(

//     officer => officer.userId === userId

//   );

//   if (!this.selectedOfficer) {

//     this.warningMessage =
// `⚠ No officer found for the logged-in account.

// Please contact the administrator.`;

//   }

// }


// /* ================= Filters ================= */

// getDepartments() {

//   return [...new Set(this.employees.map(e => e.department))];

// }

// getOffices() {

//   return [...new Set(this.employees.map(e => e.office))];

// }

// getDesignations() {

//   return [...new Set(this.employees.map(e => e.designation))];

// }

// filterEmployees(group: any) {

//   return group.employees.filter((emp: any) => {

//     const departmentMatch =
//       !this.selectedDepartment ||
//       emp.department === this.selectedDepartment;

//     const officeMatch =
//       !this.selectedOffice ||
//       emp.office === this.selectedOffice;

//     const designationMatch =
//       !this.selectedDesignation ||
//       emp.designation === this.selectedDesignation;

//     const searchMatch =
//       !this.searchText ||
//       emp.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
//       emp.employeeCode.toLowerCase().includes(this.searchText.toLowerCase());

//     return (
//       departmentMatch &&
//       officeMatch &&
//       designationMatch &&
//       searchMatch
//     );

//   });

// }

// resetFilters() {

//   this.selectedDepartment = '';

//   this.selectedOffice = '';

//   this.selectedDesignation = '';

//   this.searchText = '';

// }

// toggleSelectAll() {

//   this.eligibleEmployees.forEach(group => {

//     group.employees.forEach((emp: any) => {

//       if (!emp.isAssigned) {

//         emp.selected = this.selectAll;

//       }

//     });

//   });

// }

// toggleEmployeeSelection() {

//   let total = 0;

//   let selected = 0;

//   this.eligibleEmployees.forEach(group => {

//     group.employees.forEach((emp: any) => {

//       if (!emp.isAssigned) {

//         total++;

//         if (emp.selected) {

//           selected++;

//         }

//       }

//     });

//   });

//   this.selectAll = total > 0 && total === selected;

// }

// generateBatchNumbers() {

//   let employeeNumber = 1;

//   this.eligibleEmployees.forEach(group => {

//     group.employees.forEach((emp: any) => {

//       if (emp.selected) {

//         emp.batchNumber =
//           `LOT${this.currentLot}-${employeeNumber
//             .toString()
//             .padStart(3, '0')}`;

//         employeeNumber++;

//       }

//     });

//   });

// }
// /* ================= Selected Employees Count ================= */

// getSelectedCount(): number {

//   let count = 0;

//   this.eligibleEmployees.forEach(group => {

//     group.employees.forEach((emp: any) => {

//       if (emp.selected) {

//         count++;

//       }

//     });

//   });

//   return count;

// }

// }


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
  eligibleEmployees: any[] = [];
  recommendedEmployees: any[] = [];

  availabilityMessages: string[] = [];
  warningMessage = '';

  loggedInUser: any = null;
  isAdmin = false;

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
    this.eligibleEmployees = [];
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

    this.eligibleEmployees = [];
    this.availabilityMessages = [];

    this.requiredStaff.forEach((staff: any) => {

      const rule = this.eligibilityRules.find(
        (r: any) =>
          r.projectId === Number(this.selectedProject) &&
          r.dutyRole === staff.dutyRole
      );

      if (!rule) {
        return;
      }

      const employees = this.employees.filter((emp: any) =>

        rule.eligibleDesignations.includes(emp.designation) &&
        !emp.isAssigned

      );

      const shuffledEmployees = this.shuffleEmployees(employees);

      const selectedEmployees = shuffledEmployees.slice(
        0,
        Number(staff.count)
      );

      selectedEmployees.forEach((emp: any) => {

        emp.selected = false;
        emp.recommended = false;
        emp.rejectReason = '';
        emp.otherReason = '';

      });

      const remainingEmployees = employees.filter(
        (e: any) => !selectedEmployees.includes(e)
      );

      remainingEmployees.forEach((emp: any) => {

        emp.selected = false;
        emp.recommended = false;
        emp.rejectReason = '';
        emp.otherReason = '';

      });

      if (selectedEmployees.length < Number(staff.count)) {

        this.availabilityMessages.push(
          `${staff.dutyRole}: Required ${staff.count}, Available ${selectedEmployees.length}`
        );

      }

      this.eligibleEmployees.push({

        dutyRole: staff.dutyRole,

        required: staff.count,

        employees: [
          ...selectedEmployees,
          ...remainingEmployees
        ]

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

    // ==========================
  // Recommended Assignment
  // ==========================

  generateRecommendedEmployees(): void {

    if (!this.selectedOfficer) {

      alert('Please select an officer.');
      return;

    }

    this.eligibleEmployees = [];
    this.availabilityMessages = [];

    this.requiredStaff.forEach((staff: any) => {

      const rule = this.eligibilityRules.find(
        (r: any) =>
          r.projectId === Number(this.selectedProject) &&
          r.dutyRole === staff.dutyRole
      );

      if (!rule) {
        return;
      }

      const employees = this.employees.filter((emp: any) =>

        rule.eligibleDesignations.includes(emp.designation) &&
        emp.constituency === this.selectedOfficer.constituency &&
        !emp.isAssigned

      );

      const shuffledEmployees = this.shuffleEmployees(employees);

      const recommendedEmployees = shuffledEmployees.slice(
        0,
        Number(staff.count)
      );

      recommendedEmployees.forEach((emp: any) => {

        emp.selected = false;
        emp.recommended = true;
        emp.rejectReason = '';
        emp.otherReason = '';

      });

      const remainingEmployees = employees.filter(
        (e: any) => !recommendedEmployees.includes(e)
      );

      remainingEmployees.forEach((emp: any) => {

        emp.selected = false;
        emp.recommended = false;
        emp.rejectReason = '';
        emp.otherReason = '';

      });

      if (recommendedEmployees.length < Number(staff.count)) {

        this.availabilityMessages.push(
          `${staff.dutyRole}: Required ${staff.count}, Available ${recommendedEmployees.length}`
        );

      }

      this.eligibleEmployees.push({

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
        this.availabilityMessages.join('\n') +
        '\n\nOnly the available employees have been displayed.';

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

    this.generateBatchNumbers();

    let assignedCount = 0;

    this.eligibleEmployees.forEach((group: any) => {

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

    this.generatedLots.push({

      lotNumber: this.currentLot,

      employees: JSON.parse(
        JSON.stringify(this.eligibleEmployees)
      )

    });

    this.currentLot++;

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

    this.eligibleEmployees.forEach((group: any) => {

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

  toggleEmployeeSelection(): void {

    let total = 0;
    let selected = 0;

    this.eligibleEmployees.forEach((group: any) => {

      group.employees.forEach((emp: any) => {

        if (!emp.isAssigned) {

          total++;

          if (emp.selected) {

            selected++;

          }

        }

      });

    });

    this.selectAll = total > 0 && total === selected;

  }

  // ==========================
  // Batch Number Generation
  // ==========================

  generateBatchNumbers(): void {

    let employeeNumber = 1;

    this.eligibleEmployees.forEach((group: any) => {

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

    this.eligibleEmployees.forEach((group: any) => {

      group.employees.forEach((emp: any) => {

        if (emp.selected) {

          count++;

        }

      });

    });

    return count;

  }

}