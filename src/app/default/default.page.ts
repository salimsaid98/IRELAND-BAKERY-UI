import { Component, OnInit } from '@angular/core';
import { addIcons } from 'ionicons';
import { IonicModule } from '@ionic/angular';
import { home, library, radio, person, document as documentIcon, settings, gitCompare } from 'ionicons/icons';
import { Route, Router } from '@angular/router';
import { RolesServiseService } from '../services/roles/roles-servise.service';
@Component({
  selector: 'app-default',
  templateUrl: './default.page.html',
  styleUrls: ['./default.page.scss'],
  standalone: true,
  imports: [IonicModule]
 
})
export class DefaultPage  {



  constructor(private route :Router, private roles:RolesServiseService) {
    /**
     * Any icons you want to use in your application
     * can be registered in app.component.ts and then
     * referenced by name anywhere in your application.
     */
    addIcons({ library, home, radio, person, documentIcon, settings, gitCompare });
  }
 ngOnInit(): void {
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements OnInit' to the class.
  this.getRoles();
 }

  cust_list(){
    this.route.navigate(['auth/customer_list']);
    
  }

  role_name:any
    isAdmin : boolean = false;
    isChief : boolean = false;
    IsAttendant : boolean = false;
  
    getRoles(){
    const userId = localStorage.getItem('app_user_id');
    this.roles.getRoleNameByUserID(userId).subscribe(respo=>{
      // console.log('User roles:', respo);
      this.role_name=respo[0]?.name;
      console.log("role name",this.role_name)
      if(this.role_name === 'Admin' || this.role_name === 'Attendant'){
        this.isAdmin = false;
        this.isChief = true;
        this.IsAttendant = true;  
      }
      if(this.role_name === 'Chief'){
        this.isChief = false;
        this.isAdmin = true;
        this.IsAttendant = true;  
      }
     
     
    });
  }
}
