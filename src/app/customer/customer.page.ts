import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.page.html',
  styleUrls: ['./customer.page.scss'],
  standalone: true,
  imports: [IonicModule , CommonModule, FormsModule]
})
export class CustomerPage {
constructor(private router:Router){

}
  create_cust(){
    this.router.navigate(['auth/customer_list'])
  }
  customer_view(){
    this.router.navigate(['auth/customer_view'])
  }
  receive_payment(){
    this.router.navigate(['auth/receive_payment'])
  }
}
