import { Injectable } from '@angular/core';
import { authData } from './auth-data';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  login(username: string, password: string) {

    const user = authData.users.find(

      u =>

        u.username.toLowerCase() === username.trim().toLowerCase() &&

        u.password === password.trim()

    );

    if (user) {

      localStorage.setItem(
        'loggedInUser',
        JSON.stringify(user)
      );

      return user;

    }

    return null;

  }

  logout() {

    localStorage.removeItem('loggedInUser');

  }

  getLoggedInUser() {

    const user = localStorage.getItem('loggedInUser');

    return user ? JSON.parse(user) : null;

  }

  getLoggedInUserId(): string | null {

    const user = this.getLoggedInUser();

    return user ? user.username : null;

  }

  isAdmin(): boolean {

    const user = this.getLoggedInUser();

    return user?.role === 'Admin';

  }

  isOfficer(): boolean {

    const user = this.getLoggedInUser();

    return user?.role === 'Officer';

  }

  isLoggedIn(): boolean {

    return this.getLoggedInUser() !== null;

  }

}