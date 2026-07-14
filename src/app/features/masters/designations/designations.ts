import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { designationData } from '../../../core/services/designation-data';
import { projectData } from '../../../core/services/project-data';

@Component({
  selector: 'app-designations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './designations.html',
  styleUrl: './designations.css'
})
export class Designations {

  designations = designationData.designations;
  projects = projectData.projects;

  selectedProject = '';

  dutyRole = '';
  description = '';

  searchText = '';

  showModal = false;

  isEditMode = false;
  editingDesignationId = 0;

  openModal() {
    this.showModal = true;
  }

  closeModal() {

    this.showModal = false;

    this.selectedProject = '';
    this.dutyRole = '';
    this.description = '';

    this.isEditMode = false;
    this.editingDesignationId = 0;

  }

  getProjectName(projectId: number) {

    return this.projects.find(
      p => p.id === projectId
    )?.name || '';

  }

  saveDesignation() {

    if (
      this.selectedProject === '' ||
      this.dutyRole.trim() === '' ||
      this.description.trim() === ''
    ) {

      alert('Please fill all fields.');

      return;

    }

    const projectId = Number(this.selectedProject);

    if (this.isEditMode) {

      const designationExists = this.designations.some(

        d =>

          d.id !== this.editingDesignationId &&

          d.projectId === projectId &&

          d.dutyRole
            .trim()
            .replace(/\s+/g, '')
            .toLowerCase() ===

          this.dutyRole
            .trim()
            .replace(/\s+/g, '')
            .toLowerCase()

      );

      if (designationExists) {

        alert('Duty Role already exists for this project!');

        return;

      }

      const designation = this.designations.find(

        d => d.id === this.editingDesignationId

      );

      if (designation) {

        designation.projectId = projectId;
        designation.dutyRole = this.dutyRole.trim();
        designation.description = this.description.trim();

      }

    }

    else {

      const designationExists = this.designations.some(

        d =>

          d.projectId === projectId &&

          d.dutyRole
            .trim()
            .replace(/\s+/g, '')
            .toLowerCase() ===

          this.dutyRole
            .trim()
            .replace(/\s+/g, '')
            .toLowerCase()

      );

      if (designationExists) {

        alert('Duty Role already exists for this project!');

        return;

      }

      this.designations.push({

        id: this.designations.length + 1,

        projectId: projectId,

        dutyRole: this.dutyRole.trim(),

        description: this.description.trim()

      });

    }

    this.closeModal();

  }

  filteredDesignations() {

    const search = this.searchText.toLowerCase();

    return this.designations.filter(d =>

      this.getProjectName(d.projectId).toLowerCase().includes(search) ||

      d.dutyRole.toLowerCase().includes(search) ||

      d.description.toLowerCase().includes(search)

    );

  }

  editDesignation(designation: any) {

    this.isEditMode = true;

    this.editingDesignationId = designation.id;

    this.selectedProject = designation.projectId.toString();

    this.dutyRole = designation.dutyRole;

    this.description = designation.description;

    this.showModal = true;

  }

  deleteDesignation(id: number) {

    const confirmDelete = confirm(
      'Are you sure you want to delete this duty role?'
    );

    if (!confirmDelete) {

      return;

    }

    this.designations = this.designations.filter(

      d => d.id !== id

    );

  }

}