import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private apiUrl = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {

    return this.http.post<any>(
      `${this.apiUrl}/login`,
      {
        username,
        password
      }
    ).pipe(

      tap(user => {

        localStorage.setItem(
          'loggedInUser',
          JSON.stringify(user)
        );

      })

    );

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