import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { designationData } from '../../../core/services/designation-data';

@Component({
  selector: 'app-designations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './designations.html',
  styleUrl: './designations.css'
})
export class Designations {

  designations = designationData.designations;

  role = '';
  description = '';

  searchText = '';

  showModal = false;

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;

    this.role = '';
    this.description = '';
  }

}