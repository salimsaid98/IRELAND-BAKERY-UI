import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonIcon,
  IonButtons,
  IonGrid,
  IonRow,
  IonCol,
  IonBackButton,
  IonList,
  IonItem,
  IonItemGroup,
  IonLabel,
  IonBadge
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderServicesService } from '../services/order/order-services.service';
import { CustomerServicesService } from '../services/customer/customer-services.service';

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

@Component({
  selector: 'app-customer-view',
  templateUrl: './customer-view.page.html',
  styleUrls: ['./customer-view.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonButton,
    IonIcon,
    IonButtons,
    IonGrid,
    IonRow,
    IonCol,
    IonBackButton,
    IonList,
    IonItem,
    IonItemGroup,
    IonLabel,
    IonBadge
]
})
export class CustomerViewPage implements OnInit {
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
    ,private customerservice:CustomerServicesService, private rout: ActivatedRoute 
  ) {
    // Get customer from navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['customer']) {
      this.customer = navigation.extras.state['customer'];
    }
    this.id = this.rout.snapshot.params['id'];
    
  }

  ngOnInit() {
    this.loadOrders();
    this.getCustimerBYID(this.id);
    this.getCurrentCurentBalance(this.id)

  }
ionViewWillEnter() {
  const navigation = this.router.getCurrentNavigation();

  if (navigation?.extras?.state?.['customer']) {
    this.customer = navigation.extras.state['customer'];
  }

  if (!this.customer?.customer_id) return;

  this.loadOrders();
  this.getCurrentCurentBalance(this.id)
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

    this.orderservice.getOrderByCustomerId(this.id).subscribe(respo=>{
      console.log(respo)
      this.orders = respo
    });
  }

  getCustimerBYID(id:any){
    this.customerservice.get_CustomerByID(id).subscribe(respo=>{
      this.customer = respo;
      console.log("customer by id",this.customer);
    }); 
  }
  editCustomer() {
    const id = this.customer.customer_id;
    this.router.navigate(['/auth/edit-customer', { id}]);
  }

  receivePayment() {
     const id = this.customer.customer_id;
    this.router.navigate(['/auth/receive_payment', { id}]);
  }

  createOrder() {
    const id = this.customer.customer_id;
    this.router.navigate(['/auth/home']);
  }   
  viewPaymentHistory() {
    const id = this.customer.customer_id; 
    this.router.navigate(['/auth/payment-history',{ id}]);
  }

  viewOrderDetails(order: Order) {
    console.log("view order details",order.order_id);
    // this.router.navigate(['/auth/order_details'], { 
    //   state: { order: order, customer: this.customer } 
    // });
    const id = order.order_id;
    this.router.navigate(['/auth/order_details', { id}]);
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
