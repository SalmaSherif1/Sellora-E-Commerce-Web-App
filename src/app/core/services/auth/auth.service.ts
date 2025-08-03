import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient, private router: Router) {}
  userData: any;

  signUp(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/auth/signup`,
      data
    );
  }
  signIn(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/auth/signin`,
      data
    );
  }
  getUserData(): void {
    this.userData = jwtDecode(localStorage.getItem('myToken')!);
    console.log(this.userData);
  }
  signOut() {
    localStorage.removeItem('myToken');
    this.userData = null;
    this.router.navigate(['/login']);
  }
}
