import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import {  IonModal, ToastController } from '@ionic/angular';

import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentServiceService } from '../services/payment/payment-service.service';
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
  selector: 'app-receive-payment',
  templateUrl: './receive-payment.page.html',
  styleUrls: ['./receive-payment.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class ReceivePaymentPage implements OnInit  {
id: any;
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getCurrentCurentBalance();
    this.getCustomerByID(this.id);

  }
    customer: Customer = {
    customer_id: '',
    customer_email: '',
    customer_name: '',
    customer_phone: '',
    customer_createdDate: new Date(), 
    customer_balance: 0
  };

  paymentForm: FormGroup; // Add if not present
  constructor(private fb: FormBuilder,
    private router: Router,
  private paymentService: PaymentServiceService,private customerservice:CustomerServicesService,
private toastController: ToastController,private rout: ActivatedRoute) {
    this.id = this.rout.snapshot.params['id'];

     const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['customer']) {
      this.customer = navigation.extras.state['customer'];
    }
      this.paymentForm = this.fb.group({
      amount: ['', Validators.required],
      payment_method: ['', Validators.required],
      payment_date: [new Date().toISOString().split('T')[0]], // ✅ local date
      notes: [''],
      app_user_id:[localStorage.getItem('app_user_id')],
      customer_id: [this.id]
    });

  }



  getCustomerByID(id:any){
    this.customerservice.get_CustomerByID(id).subscribe(respo=>{
      this.customer = respo;
      console.log("customer by id",this.customer);
    });
  }
savepayment(data:any){
    this.paymentService.createPayment(data).subscribe(
      (response) => {
        console.log('Payment created successfully:', response);
        this.showToast('Payment received successfully', 'success');
        this.customer.customer_id = response.customer_id;
            const id = this.id
           this.router.navigate(['/auth/customer_view',{id}]);
            
        // Optionally navigate to another page or show a success message
        
      },
      (error) => {
        console.error('Error creating payment:', error);
        this.showToast('Failed to receive payment', 'danger');
      }
    );
  }

  submitPayment() {
    // Implementation here
    // console.log('Payment submitted:', this.paymentForm.value);
    this.savepayment(this.paymentForm.value);
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

    currentbalance: any;
  getCurrentCurentBalance(){

    this.customerservice.getCustomerIDbalance(this.customer.customer_id).subscribe(respo=>{
      this.currentbalance = respo.currentbalance;
      console.log("curentbalance",this.currentbalance);
    });

  }
}

