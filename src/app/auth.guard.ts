import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const userId = localStorage.getItem('app_user_id');

    if (userId) {
      return true;
    }

    // ❌ Not logged in → redirect
    this.router.navigate(['/login']);
    return false;
  }
}
