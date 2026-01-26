import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { Route, Router } from '@angular/router';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule , CommonModule, FormsModule]
})
export class ProfilePage  {

  constructor(private route: Router) { }

  logout() {
    localStorage.removeItem('app_user_id');
    this.route.navigate(['/login']);

}
}