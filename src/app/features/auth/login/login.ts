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

    const user = this.auth.login(
      this.username,
      this.password
    );

    if (user) {

      this.router.navigate(['/dashboard']);

    } else {

      alert('Invalid username or password.');

    }

  }

}