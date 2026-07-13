import { Injectable } from '@angular/core';
import { authData } from './auth-data';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  login(username: string, password: string) {

    const user = authData.users.find(
      u =>
        u.username === username &&
        u.password === password
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

  isLoggedIn() {

    return this.getLoggedInUser() !== null;

  }

}