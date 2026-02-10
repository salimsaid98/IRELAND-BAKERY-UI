import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonModal, ToastController, LoadingController } from '@ionic/angular';

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
  isSaving: boolean = false;
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
private toastController: ToastController, private loadingController: LoadingController, private rout: ActivatedRoute) {
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
      customer_id: [this.id],
      loader_seconds: [0]
    });

  }



  getCustomerByID(id:any){
    this.customerservice.get_CustomerByID(id).subscribe(respo=>{
      this.customer = respo;
      console.log("customer by id",this.customer);
    });
  }

  async presentLoader(minDurationMs: number = 0) {
    const start = Date.now();
    const loading = await this.loadingController.create({
      spinner: 'crescent',
      message: 'Processing...',
      backdropDismiss: false
    });
    await loading.present();

    return {
      dismiss: async () => {
        const elapsed = Date.now() - start;
        const remaining = minDurationMs - elapsed;
        if (remaining > 0) {
          await new Promise(res => setTimeout(res, remaining));
        }
        try { await loading.dismiss(); } catch (e) { }
      }
    };
  }

  async savepayment(data:any, minSeconds: number = 0){
    const loader = await this.presentLoader(minSeconds * 1000);
    this.isSaving = true;
    this.paymentService.createPayment(data).subscribe(
      async (response) => {
        console.log('Payment created successfully:', response);
        await loader.dismiss();
        this.isSaving = false;
        this.showToast('Payment received successfully', 'success');
        this.customer.customer_id = response.customer_id;
        const id = this.id;
        this.paymentForm.reset();
        this.router.navigate(['/auth/customer_view',{id}]);
      },
      async (error) => {
        console.error('Error creating payment:', error);
        await loader.dismiss();
        this.isSaving = false;
        this.showToast('Failed to receive payment', 'danger');
      }
    );
  }

  submitPayment() {
    const seconds = Number(this.paymentForm.value.loader_seconds) || 0;
    this.savepayment(this.paymentForm.value, seconds);
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

