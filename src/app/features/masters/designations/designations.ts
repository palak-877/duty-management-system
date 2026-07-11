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

  role = '';
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
    this.role = '';
    this.description = '';

    this.isEditMode = false;
    this.editingDesignationId = 0;

  }

  saveDesignation() {

    if (
      this.selectedProject === '' ||
      this.role.trim() === '' ||
      this.description.trim() === ''
    ) {
      alert('Please fill all fields.');
      return;
    }

    if (this.isEditMode) {

      const designationExists = this.designations.some(
        d =>
          d.id !== this.editingDesignationId &&
          d.project === this.selectedProject &&
          d.role
            .trim()
            .replace(/\s+/g, '')
            .toLowerCase() ===
          this.role
            .trim()
            .replace(/\s+/g, '')
            .toLowerCase()
      );

      if (designationExists) {
        alert('Role already exists for this project!');
        return;
      }

      const designation = this.designations.find(
        d => d.id === this.editingDesignationId
      );

      if (designation) {
        designation.project = this.selectedProject;
        designation.role = this.role.trim();
        designation.description = this.description.trim();
      }

    } else {

      const designationExists = this.designations.some(
        d =>
          d.project === this.selectedProject &&
          d.role
            .trim()
            .replace(/\s+/g, '')
            .toLowerCase() ===
          this.role
            .trim()
            .replace(/\s+/g, '')
            .toLowerCase()
      );

      if (designationExists) {
        alert('Role already exists for this project!');
        return;
      }

      this.designations.push({
        id: this.designations.length + 1,
        project: this.selectedProject,
        role: this.role.trim(),
        description: this.description.trim()
      });

    }

    this.closeModal();

  }

  filteredDesignations() {

  const search = this.searchText.toLowerCase();

  return this.designations.filter(d =>

    d.project.toLowerCase().includes(search) ||

    d.role.toLowerCase().includes(search) ||

    d.description.toLowerCase().includes(search)

  );

}

  editDesignation(designation: any) {

    this.isEditMode = true;

    this.editingDesignationId = designation.id;

    this.selectedProject = designation.project;
    this.role = designation.role;
    this.description = designation.description;

    this.showModal = true;

  }

  deleteDesignation(id: number) {

    const confirmDelete = confirm(
      'Are you sure you want to delete this role?'
    );

    if (!confirmDelete) {
      return;
    }

    this.designations = this.designations.filter(
      d => d.id !== id
    );

  }

}