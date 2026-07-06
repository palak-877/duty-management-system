import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { projectData } from '../../../core/services/project-data';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class Projects {

  projects = projectData.projects;

  showModal = false;

  projectName = '';
  projectType = 'Census';
  department = 'Revenue';
  startDate = '';
  searchText = '';
  isEditMode = false;
editingProjectId = 0;

  openModal() {
    this.showModal = true;
  }

  closeModal() {

  this.showModal = false;

  this.isEditMode = false;
  this.editingProjectId = 0;

  this.projectName = '';
  this.projectType = 'Census';
  this.department = 'Revenue';
  this.startDate = '';

}
  saveProject() {

  if (
    this.projectName.trim() === '' ||
    this.startDate === ''
  ) {
    alert('Please fill all required fields.');
    return;
  }

  if (this.isEditMode) {

    const project = this.projects.find(
      p => p.id === this.editingProjectId
    );

    if (project) {
      project.name = this.projectName;
      project.type = this.projectType;
      project.department = this.department;
      project.startDate = this.startDate;
    }

  } else {

    const projectExists = this.projects.some(
      project =>
        project.name.toLowerCase() === this.projectName.toLowerCase()
    );

    if (projectExists) {
      alert('Project already exists!');
      return;
    }

    this.projects.push({
      id: this.projects.length + 1,
      name: this.projectName,
      type: this.projectType,
      department: this.department,
      startDate: this.startDate
    });

  }

  this.projectName = '';
  this.projectType = 'Census';
  this.department = 'Revenue';
  this.startDate = '';

  this.isEditMode = false;
  this.editingProjectId = 0;

  this.closeModal();

}

deleteProject(id: number) {

  const confirmDelete = confirm(
    'Are you sure you want to delete this project?'
  );

  if (!confirmDelete) {
    return;
  }

  this.projects = this.projects.filter(
    project => project.id !== id
  );

}

editProject(project: any) {

  this.isEditMode = true;

  this.editingProjectId = project.id;

  this.projectName = project.name;
  this.projectType = project.type;
  this.department = project.department;
  this.startDate = project.startDate;

  this.openModal();

}

get filteredProjects() {
  return this.projects.filter(project =>
    project.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
    project.type.toLowerCase().includes(this.searchText.toLowerCase()) ||
    project.department.toLowerCase().includes(this.searchText.toLowerCase())
  );
}

}