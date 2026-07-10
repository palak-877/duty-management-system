import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {

  showMasters = false;

  showTransactions = false;

  showReports = false;


  toggleMasters() {

    this.showMasters = !this.showMasters;

  }


  toggleTransactions() {

    this.showTransactions = !this.showTransactions;

  }


  toggleReports() {

    this.showReports = !this.showReports;

  }

}