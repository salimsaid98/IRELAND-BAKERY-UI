import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonInput } from '@ionic/angular';
import { IonicModule ,IonModal, ToastController,LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthServicesService } from '../services/auth/auth-services.service';
import { RolesServiseService } from '../services/roles/roles-servise.service';

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
  constructor(private route:Router,private auth:AuthServicesService,
     private loadingController: LoadingController,
    private toastController: ToastController,
  private roleservice:RolesServiseService) { 
    // const userId = localStorage.getItem('app_user_id');
    //     if (userId) {
    //       this.route.navigate(['/auth/home']);
    //     }
  }
  email: string = '';
  password: string = '';


 login(){
  this.loginFunction(this.email,this.password)

 }
isSubmitting: boolean = false;
  async loginFunction(username: any, password: any) {
   this.isSubmitting = true;

          const loading = await this.loadingController.create({
            spinner: 'crescent',
            message: 'login...',
            backdropDismiss: false
          });
          await loading.present();
          this.auth.login(username, password).subscribe(
            async (respo: any) => {
              
              if (respo) {
        
        // ✅ store user id
        localStorage.setItem('app_user_id', respo.app_user_id);

          //  const userId = localStorage.getItem('app_user_id');
        this.showToast('Login successful', 'success');
        
            await loading.dismiss();
            this.isSubmitting = false;

        setTimeout(() => {
          this.getRoles(respo.app_user_id);
          // this.route.navigate(['/auth/home']);
        }, 300);

      } else {
        this.showToast('Invalid username or password', 'danger');
          await loading.dismiss();  
          this.isSubmitting = false;
        setTimeout(() => {
          
          // this.route.navigate(['/auth/home']);
        }, 300);

      }
    },
    async (error) => {
      console.error(error);
        await loading.dismiss();
          this.isSubmitting = false;
      this.showToast('Server error. Try again later', 'danger');
    }
  );
}

// getRoles() {
//   const userId = localStorage.getItem('app_user_id');
//   this.roleservice.getAllCashOrderByUserID(userId).subscribe(
//     (respo: any) => {
//       console.log('User roles:', respo);
//     },
//     (error) => {
//       console.error('Error fetching roles:', error);
//     }
//   );
// }

getRoles(id: any) {
  console.log('Fetching roles for user ID:', id);
  this.roleservice.getRoleNameByUserID(id).subscribe(
    (respo: any) => {
      const userRole = respo[0]?.name;
      console.log('User role:', userRole);

      if (userRole === 'Admin') {
        console.log('Admin detected, navigating to admin dashboard');
        this.route.navigate(['/auth/home']);
      } else if (userRole === 'Chief') {
        console.log('Chief detected, navigating to chief dashboard');
        this.route.navigate(['/auth/chief']);
      } else if (userRole === 'Attendant') {
        console.log('Attendant detected, navigating to home');
        this.route.navigate(['/auth/home']);
      } else {
        console.warn('Unknown role:', userRole);
        this.route.navigate(['/auth/home']);
      }
    },
    (error: any) => {
      console.error('Error fetching user roles:', error);
      this.showToast('Failed to fetch user roles', 'danger');
      // Default navigation on error
      this.route.navigate(['/auth/home']);
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
