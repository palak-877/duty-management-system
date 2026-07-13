import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../core/services/auth';

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

  loggedInUser: any = null;

  role = '';

  constructor(private auth: Auth) {

    this.loggedInUser = this.auth.getLoggedInUser();

    this.role = this.loggedInUser?.role;

  }

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