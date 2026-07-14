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

    this.isEditMode = false;
    this.editingOfficerId = 0;

  }

  getProjectName(projectId: number) {

    return this.projects.find(

      p => p.id === projectId

    )?.name || '';

  }

  filteredOfficers() {

    const search = this.searchText.toLowerCase();

    return this.officers.filter(officer =>

      officer.name.toLowerCase().includes(search) ||

      this.getProjectName(officer.projectId).toLowerCase().includes(search) ||

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

    const projectId = Number(this.selectedProject);

    if (this.isEditMode) {

      const officerExists = this.officers.some(

        o =>

          o.id !== this.editingOfficerId &&

          o.name.trim().toLowerCase() ===
          this.officerName.trim().toLowerCase() &&

          o.projectId === projectId

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
        officer.projectId = projectId;
        officer.officerRole = this.selectedOfficerRole;
        officer.constituency = this.constituency.trim();
        officer.address = this.address.trim();

      }

    }

    else {

      const officerExists = this.officers.some(

        o =>

          o.name.trim().toLowerCase() ===
          this.officerName.trim().toLowerCase() &&

          o.projectId === projectId

      );

      if (officerExists) {

        alert('Officer already exists for this project.');

        return;

      }

      this.generatedUserId = this.generateUserId();

      this.officers.push({

        id: this.officers.length + 1,

        userId: this.generatedUserId,

        name: this.officerName.trim(),

        officerRole: this.selectedOfficerRole,

        projectId: projectId,

        constituency: this.constituency.trim(),

        address: this.address.trim()

      });

      alert(

`Officer created successfully!

User ID: ${this.generatedUserId}

Please create login credentials separately in Auth Management.`

      );

    }

    this.closeModal();

  }

  editOfficer(officer: any) {

    this.isEditMode = true;

    this.editingOfficerId = officer.id;

    this.officerName = officer.name;
    this.selectedProject = officer.projectId.toString();
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