import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonModal, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CustomerServicesService } from '../services/customer/customer-services.service';
interface Customer {
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  customer_balance: number;
  customer_email: string;
  customer_createdDate: Date;
}
@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})



export class EditCustomerComponent implements OnInit {

  CustomerData!: Customer;

  constructor(private router: Router,
    private customerService:CustomerServicesService,
    private toastController:ToastController
  ) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { customer: Customer };

    if (state?.customer) {
      this.CustomerData = state.customer;   // ✅ DATA FETCHED HERE
    } else {
      // Optional safety redirect
      this.router.navigate(['/auth/customer_list']);
    }
     this.getAllCustomers();
  }

  getAllCustomers() {
    this.customerService.getAllCustomer().subscribe((res: any) => {
      console.log(res);
    });
  }

  addCustomer() {
    // this.customerService.updateCustomer(this.CustomerData.customer_id,this.CustomerData).subscribe(async res=>{
    //   const toast = await this.toastController.create({
    //     message: 'Customer updated successfully', 
    //     duration: 2000,
    //     color: 'success',
    //     position: 'top'

    //   });
    //   await toast.present();
    //   this.router.navigate(['/auth/customer_list']);
    // });
    // console.log(this.CustomerData); // updated data
    const data = {
      
      customer_name: this.CustomerData.customer_name,
      customer_phone: this.CustomerData.customer_phone,
      customer_createdDate: this.CustomerData.customer_createdDate,
      customer_balance: this.CustomerData.customer_balance
    };
    this.customerService.updateCustomer(this.CustomerData.customer_id, data).subscribe(async res => {
      const toast = await this.toastController.create({
        message: 'Customer updated successfully',
        duration: 2000,
        color: 'success',
        position: 'top'
      });
      await toast.present();
      this.getAllCustomers()
      this.router.navigate(['/auth/customer_list']);
      console.log("respone",res);
    });
// console.log(data);
  }
}
