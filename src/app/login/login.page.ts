import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonInput } from '@ionic/angular';
import { IonicModule ,IonModal, ToastController} from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthServicesService } from '../services/auth/auth-services.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
   
    CommonModule, 
    FormsModule,
    IonicModule
  ],
})
export class LoginPage  {
    @ViewChild('emailInput', { static: false }) emailInput!: IonInput;
  @ViewChild('passwordInput', { static: false }) passwordInput!: IonInput;

  focusEmail() {
    this.emailInput.setFocus();
  }

  focusPassword() {
    this.passwordInput.setFocus();
  }
  constructor(private route:Router,private auth:AuthServicesService,private toastController: ToastController){
    const userId = localStorage.getItem('app_user_id');
        if (userId) {
          this.route.navigate(['/auth/home']);
        }
  }
  email: string = '';
  password: string = '';

 login(){
  this.loginFunction(this.email,this.password)

 }
loginFunction(username: any, password: any) {
  this.auth.login(username, password).subscribe(
    (respo: any) => {
      if (respo) {

        // ✅ store user id
        localStorage.setItem('app_user_id', respo.app_user_id);
          //  const userId = localStorage.getItem('app_user_id');
        this.showToast('Login successful', 'success');

        setTimeout(() => {
          this.route.navigate(['/auth/home']);
        }, 300);

      } else {
        this.showToast('Invalid username or password', 'danger');
      }
    },
    (error) => {
      console.error(error);
      this.showToast('Server error. Try again later', 'danger');
    }
  );
}


  private async showToast(
    message: string,
    color: 'success' | 'warning' | 'danger' | 'primary' = 'primary'
  ): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color,
    });
    await toast.present();
  }


}
