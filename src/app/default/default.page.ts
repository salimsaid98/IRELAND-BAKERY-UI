import { Component, OnInit } from '@angular/core';
import { addIcons } from 'ionicons';
import { IonicModule } from '@ionic/angular';
import { home, library, radio, person, document as documentIcon, settings, gitCompare } from 'ionicons/icons';
import { Route, Router } from '@angular/router';
@Component({
  selector: 'app-default',
  templateUrl: './default.page.html',
  styleUrls: ['./default.page.scss'],
  standalone: true,
  imports: [IonicModule]
 
})
export class DefaultPage  {



  constructor(private route :Router) {
    /**
     * Any icons you want to use in your application
     * can be registered in app.component.ts and then
     * referenced by name anywhere in your application.
     */
    addIcons({ library, home, radio, person, documentIcon, settings, gitCompare });
  }
  cust_list(){
    this.route.navigate(['auth/customer_list']);
    
  }
}
