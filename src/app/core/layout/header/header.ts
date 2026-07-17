import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  loggedInUser: any;

constructor(
  private auth: Auth,
  private router: Router
) {
  this.loggedInUser = this.auth.getLoggedInUser();
}



  logout() {

    this.auth.logout();

    this.router.navigate(['/login']);

  }

}