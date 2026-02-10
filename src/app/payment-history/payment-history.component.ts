import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonBackButton } from "@ionic/angular/standalone";
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderServicesService } from '../services/order/order-services.service';
import { CustomerServicesService } from '../services/customer/customer-services.service';
import { PaymentServiceService } from '../services/payment/payment-service.service';
import { AlertController } from '@ionic/angular';
import { RolesServiseService } from '../services/roles/roles-servise.service';
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
  username: string;
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
      ,private paymentservice:PaymentServiceService, private alertController: AlertController,
      private roles:RolesServiseService
    ) {
      // Get customer from navigation state
    
       this.id = this.route.snapshot.params['id'];
    }
  
    ngOnInit() {
      this.getRoles();
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
    viewPaymentDetails(payment: Payment) {
    
    }
  
 

  async deletePayment(payment: Payment) {
  const alert = await this.alertController.create({
    header: 'Delete Payment',
    message: `Are you sure you want to delete this payment?`,
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: 'Delete',
        role: 'destructive',
        handler: () => {
          this.deletePaymentFunction(payment); // ✅ CALL DELETE
        }
      }
    ]
  });

  await alert.present();
}

deletePaymentFunction(payment: Payment) {
  this.paymentservice.deletePayment(payment.payment_id).subscribe({
    next: async () => {
      const alert = await this.alertController.create({
        header: 'Success',
        message: `Payment deleted successfully`,
        buttons: ['OK']
      });
      await alert.present();

      this.getAllPaymentsByCustomerID(this.id); // 🔄 refresh list
    },
    error: async () => {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Failed to delete payment',
        buttons: ['OK']
      });
      await alert.present();
    } 
  });
}
      // t
   goBack() {
    const id = this.id;
    this.router.navigate(['/auth/customer_view',{ id}]); 
  }
   
  role_name:any
isAdmin : boolean = false;
  getRoles(){
    const userId = localStorage.getItem('app_user_id');
    this.roles.getRoleNameByUserID(userId).subscribe(respo=>{
      // console.log('User roles:', respo);
      this.role_name=respo[0]?.name;
      console.log("role name",this.role_name)

      if(this.role_name === "Admin"){
        this.isAdmin = true;
      }
    });
  }
  
}

