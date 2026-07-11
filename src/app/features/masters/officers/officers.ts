import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { officerData } from '../../../core/services/officer-data';
import { projectData } from '../../../core/services/project-data';
import { officerRoleData } from '../../../core/services/officer-role-data';

@Component({
  selector: 'app-officers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './officers.html',
  styleUrl: './officers.css'
})
export class Officers {

  searchText = '';

  officers = officerData.officers;
  projects = projectData.projects;
  officerRoles = officerRoleData.roles;

  showModal = false;
selectedOfficerRole = '';
officerName = '';
selectedProject = '';
constituency = '';
address = '';

generatedUserId = '';
generatedPassword = '';

isEditMode = false;
editingOfficerId = 0;
selectedOfficer: any = null;

showViewModal = false;

  openModal() {

  this.showModal = true;

}

closeModal() {

  this.showModal = false;

  this.officerName = '';
  this.selectedProject = '';
  this.selectedOfficerRole = '';
  this.constituency = '';
  this.address = '';

  this.generatedUserId = '';
  this.generatedPassword = '';
  this.isEditMode = false;
this.editingOfficerId = 0;


}

  filteredOfficers() {

  const search = this.searchText.toLowerCase();

  return this.officers.filter(officer =>

    officer.name.toLowerCase().includes(search) ||

    officer.project.toLowerCase().includes(search) ||

    officer.officerRole.toLowerCase().includes(search) ||

    officer.constituency.toLowerCase().includes(search) ||

    officer.userId.toLowerCase().includes(search)

  );

}

generateUserId(): string {

  const prefix = this.constituency
    .trim()
    .substring(0, 3)
    .toUpperCase();

  const number = String(this.officers.length + 1).padStart(3, '0');

  return `${prefix}${number}`;

}

generatePassword(): string {

  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

  let password = '';

  for (let i = 0; i < 10; i++) {

    const index = Math.floor(Math.random() * chars.length);

    password += chars[index];

  }

  return password;

}
saveOfficer() {

  if (
    this.officerName.trim() === '' ||
    this.selectedProject === '' ||
    this.selectedOfficerRole === '' ||
    this.constituency.trim() === '' ||
    this.address.trim() === ''
  ) {
    alert('Please fill all fields.');
    return;
  }

  // EDIT MODE
  if (this.isEditMode) {

    const officerExists = this.officers.some(o =>

      o.id !== this.editingOfficerId &&

      o.name.trim().toLowerCase() ===
      this.officerName.trim().toLowerCase()

      &&

      o.project === this.selectedProject

    );

    if (officerExists) {

      alert('Officer already exists for this project.');

      return;

    }

    const officer = this.officers.find(
      o => o.id === this.editingOfficerId
    );

    if (officer) {

      officer.name = this.officerName.trim();
      officer.project = this.selectedProject;
      officer.officerRole = this.selectedOfficerRole;
      officer.constituency = this.constituency.trim();
      officer.address = this.address.trim();

    }

  }

  // ADD MODE
  else {

    const officerExists = this.officers.some(o =>

      o.name.trim().toLowerCase() ===
      this.officerName.trim().toLowerCase()

      &&

      o.project === this.selectedProject

    );

    if (officerExists) {

      alert('Officer already exists for this project.');

      return;

    }

    this.generatedUserId = this.generateUserId();
    this.generatedPassword = this.generatePassword();

    this.officers.push({

      id: this.officers.length + 1,

      name: this.officerName.trim(),

      project: this.selectedProject,

      officerRole: this.selectedOfficerRole,

      constituency: this.constituency.trim(),

      address: this.address.trim(),

      userId: this.generatedUserId,

      password: this.generatedPassword

    });

    alert(
`Officer created successfully!

User ID: ${this.generatedUserId}

Password: ${this.generatedPassword}

Please note these credentials.`
    );

  }

  this.closeModal();

}
editOfficer(officer: any) {

  this.isEditMode = true;

  this.editingOfficerId = officer.id;

  this.officerName = officer.name;
  this.selectedProject = officer.project;
  this.selectedOfficerRole = officer.officerRole;
  this.constituency = officer.constituency;
  this.address = officer.address;

  this.showModal = true;

}

deleteOfficer(id: number) {

  const confirmDelete = confirm(
    'Are you sure you want to delete this officer?'
  );

  if (!confirmDelete) {
    return;
  }

  this.officers = this.officers.filter(
    officer => officer.id !== id
  );

}

viewOfficer(officer: any) {

  this.selectedOfficer = officer;

  this.showViewModal = true;

}

closeViewModal() {

  this.showViewModal = false;

  this.selectedOfficer = null;

}
}