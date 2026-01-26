import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthServicesService {

  private isLoggedIn = false;

 private app_user = environment.url + 'appUsers';
   constructor( private http:HttpClient ) { }


  
  login(username: string, password: string): Observable<any> {
    return this.http.get<any>(
      `${this.app_user}/login?username=${username}&password=${password}`
    ).pipe(
      tap((response: { status: string; user: any; }) => {
        // adjust this condition based on backend response
        if (response && response.status === 'success') {
          this.isLoggedIn = true;
          localStorage.setItem('user', JSON.stringify(response.user));
        }
      })
    );
  }


  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }

  logout(): void {
    this.isLoggedIn = false;
  }
}
