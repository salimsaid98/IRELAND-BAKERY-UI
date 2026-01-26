import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderServicesService } from '../services/order/order-services.service';
import { CustomerServicesService } from '../services/customer/customer-services.service';
interface Order {
  order_id: string;
  date: Date;
  items: number;
  order_date: Date;
  total_amount: number;
  status: 'pending' | 'completed' | 'cancelled';

  
}

interface Customer {
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  customer_balance: number;
  customer_email: string;
  customer_createdDate: Date;
}
@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule, IonicModule]
})
export class HistoryPage  {
  customer: Customer = {
    customer_id: '',
    customer_email: '',
    customer_name: '',
    customer_phone: '',
    customer_createdDate: new Date(), 
    customer_balance: 0
  };

  
    
    orders: Order[] = [];
  
    constructor(private router: Router,private orderservice:OrderServicesService
      ,private customerservice:CustomerServicesService, private route: ActivatedRoute 
    ) {
      // Get customer from navigation state
      const navigation = this.router.getCurrentNavigation();
      if (navigation?.extras?.state?.['customer']) {
        this.customer = navigation.extras.state['customer'];
      }
      
    }
  
    ngOnInit() {
      this.loadOrders();
      // this.getCurrentCurentBalance(this.customer.customer_id)
    }
  ionViewWillEnter() {
    const navigation = this.router.getCurrentNavigation();
  
    if (navigation?.extras?.state?.['customer']) {
      this.customer = navigation.extras.state['customer'];
    }
  
    if (!this.customer?.customer_id) return;
  
    this.loadOrders();
    this.getCurrentCurentBalance(this.customer.customer_id);
  }
  
    
    loadOrders() {
      // Simulated orders - replace with actual API call
      // this.orders = [
      //   {
      //     id: 'ORD-001',
      //     date: new Date(2024, 0, 15),
      //     items: 5,
      //     amount: 15000,
      //     status: 'completed'
      //   },
      //   {
      //     id: 'ORD-002',
      //     date: new Date(2024, 1, 10),
      //     items: 3,
      //     amount: 8500,
      //     status: 'completed'
      //   },
      //   {
      //     id: 'ORD-003',
      //     date: new Date(2024, 2, 5),
      //     items: 7,
      //     amount: 21500,
      //     status: 'pending'
      //   },
      //   {
      //     id: 'ORD-004',
      //     date: new Date(2024, 2, 20),
      //     items: 2,
      //     amount: 5000,
      //     status: 'completed'
      //   }
      // ];
  
      this.orderservice.getAllCashOrderByUserID(localStorage.getItem('app_user_id')).subscribe(respo=>{
        respo.forEach((element:any)=>{
          console.log("this Data ",element)
        })
        // console.log(respo)
        this.orders = respo
      });
    }
  
    editCustomer() {
      // Navigate to edit customer page
      this.router.navigate(['/auth/edit-customer'], { state: { customer: this.customer } });
    }
  
    receivePayment() {
      this.router.navigate(['/auth/receive_payment'], { state: { customer: this.customer } });
    }
  
    createOrder() {
      this.router.navigate(['/auth/home'], { state: { customer: this.customer } });
    }
  
    viewOrderDetails(date: any) {
      this.router.navigate(['/auth/order_details_cash',{date}])
    }
    currentbalance: any;
    id: any;
    async getCurrentCurentBalance(customer_id:any){
  
      this.customerservice.getCustomerIDbalance(customer_id).subscribe(respo=>{
        this.currentbalance = respo.currentbalance;
        console.log("curentbalance",this.currentbalance);
      });
  
    }
}
