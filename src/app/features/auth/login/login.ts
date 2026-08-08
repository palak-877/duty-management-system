import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  username = '';
  password = '';

  constructor(
    private router: Router,
    private auth: Auth
  ) {}

  login() {

  if (
    this.username.trim() === '' ||
    this.password.trim() === ''
  ) {

    alert('Please enter username and password.');
    return;

  }

  this.auth.login(
    this.username,
    this.password
  ).subscribe({

    next: (user) => {

      this.router.navigate(['/dashboard']);

    },

    error: (error) => {

      if (error.status === 401) {

        alert('Invalid username or password.');

      } else {

        alert('Unable to connect to server.');

      }

    }

  });

}

}