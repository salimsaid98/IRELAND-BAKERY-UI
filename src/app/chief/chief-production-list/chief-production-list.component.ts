import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderServicesService } from 'src/app/services/order/order-services.service';
import { CustomerServicesService } from 'src/app/services/customer/customer-services.service';
import { ProductionServicesService } from 'src/app/services/production/production-services.service';
interface Order {
  order_id: string;
  date: Date;
  items: number;
  order_date: Date;
  total_amount: number;
  status: 'pending' | 'completed' | 'cancelled';

  
}

interface Production{
  product_id: string;
  name: string;
  total_produced: number;
  production_day: string;
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
  selector: 'app-chief-production-list',
  templateUrl: './chief-production-list.component.html',
  styleUrls: ['./chief-production-list.component.scss'],
    standalone: true,
  imports: [ CommonModule, FormsModule, IonicModule]
})
export class ChiefProductionListComponent  {
 customer: Customer = {
    customer_id: '',
    customer_email: '',
    customer_name: '',
    customer_phone: '',
    customer_createdDate: new Date(), 
    customer_balance: 0
  };

  
    
    orders: Order[] = [];
    productions: Production[] = [];
  
    constructor(private router: Router,private orderservice:OrderServicesService
      ,private customerservice:CustomerServicesService, private route: ActivatedRoute
      ,private productionservice:ProductionServicesService 
    ) {
      // Get customer from navigation state
      const navigation = this.router.getCurrentNavigation();
      if (navigation?.extras?.state?.['customer']) {
        this.customer = navigation.extras.state['customer'];
      }
      
    }
  
    
    id: any=localStorage.getItem('app_user_id');
  ionViewWillEnter() {

    this.loadProductions(this.id);

  }
  
    
    loadProductions(id:any) {
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
  
      this.productionservice.getTotalProductionByID(id).subscribe(respo=>{
        respo.forEach((element:any)=>{
          console.log("this Data ",element)
        })
        // console.log(respo)
        this.productions = respo
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
      this.router.navigate(['/auth/chief'], { state: { customer: this.customer } });
    }
  
    viewOrderDetails(date: any, name:any) {
      this.router.navigate(['/auth/chief_production_view', { date , name}]);
    }
    currentbalance: any;
   
    async getCurrentCurentBalance(customer_id:any){
  
      this.customerservice.getCustomerIDbalance(customer_id).subscribe(respo=>{
        this.currentbalance = respo.currentbalance;
        console.log("curentbalance",this.currentbalance);
      });
  
    }
}
