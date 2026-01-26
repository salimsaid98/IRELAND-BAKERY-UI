import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonBackButton } from "@ionic/angular/standalone";
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderServicesService } from '../services/order/order-services.service';
import { CustomerServicesService } from '../services/customer/customer-services.service';
import { PaymentServiceService } from '../services/payment/payment-service.service';
interface Customer {
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  customer_balance: number;
  customer_email: string;
  customer_createdDate: Date;
}
interface Order {
  order_id: string;
  date: Date;
  items: number;
  order_date: Date;
  total_amount: number;
  status: 'pending' | 'completed' | 'cancelled';

  
}

interface Payment {
  payment_id: string;
  amount: number;
  payment_method: string;
  payment_date: Date;
  notes: string;
  customer_id: string;
  app_user_id: string;
}
@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class PaymentHistoryComponent  implements OnInit {
   id: any;

  
    
  
    payments: Payment[] = [];
  
    constructor(private router: Router,private orderservice:OrderServicesService
      ,private customerservice:CustomerServicesService, private route: ActivatedRoute 
      ,private paymentservice:PaymentServiceService
    ) {
      // Get customer from navigation state
    
       this.id = this.route.snapshot.params['id'];
    }
  
    ngOnInit() {
     
      this.getAllPaymentsByCustomerID(this.id);
      // this.getCurrentCurentBalance(this.customer.customer_id)
    }
  ionViewWillEnter() {
  

    this.getAllPaymentsByCustomerID(this.id);
  }
  
    
  
    getAllPaymentsByCustomerID(id:any){
      this.paymentservice.getAllPaymentBYCustomerID(id).subscribe(respo=>{
        respo.forEach((element:any)=>{
          console.log("this payment Data ",element)
        } )
        this.payments = respo;
        // console.log("payment history",respo)
      })  
    }
  

  
    createOrder() {
      this.router.navigate(['/auth/home']);
    }
  
    viewOrderDetails(payment: Payment) {
      // this.router.navigate(['/auth/order_details'], { 
      //   state: { order: payment, customer: this.customer } 
      console.log("view payment details",payment);
      // });
    }
   goBack() {
    const id = this.id;
    this.router.navigate(['/auth/customer_view',{ id}]); 
  }
   
  
}

