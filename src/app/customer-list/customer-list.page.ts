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
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonItemGroup,
  IonItemDivider,
  IonAvatar,
  IonButtons,
  IonSearchbar,
  IonBadge,
  IonGrid,
  IonRow,
  IonCol,
  IonBackButton,
  IonSpinner
} from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerServicesService } from '../services/customer/customer-services.service';

interface Customer {
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  customer_balance: number;
  customer_email: string;
  customer_createdDate: Date;
  currentbalance: any
}

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.page.html',
  styleUrls: ['./customer-list.page.scss'],
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
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonItemGroup,
    IonItemDivider,
    IonAvatar,
    IonButtons,
    IonSearchbar,
    IonBadge,
    IonGrid,
    IonRow,
    IonCol,
    IonBackButton,
    IonSpinner
  ]
})
export class CustomerListPage implements OnInit {
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  searchText: string = '';
  isLoading: boolean = false;
  id: any;
  newCustomer: Customer = {
    customer_id: '',
    customer_email: '',
    customer_name: '',
    customer_phone: '',
    customer_createdDate: new Date(), 
    customer_balance: 0,
    currentbalance: null
  };
 customer: Customer = {
    customer_id: '',
    customer_email: '',
    customer_name: '',
    customer_phone: '',
    customer_createdDate: new Date(), 
    customer_balance: 0,
    currentbalance: null
  };

  constructor(
    private alertController: AlertController,
    private router: Router,
    private customerService: CustomerServicesService,
    private route:ActivatedRoute
    
  ) { }

  ngOnInit() {
    this.loadCustomers();
     this.id = this.route.snapshot.params['id'];
  }

  ionViewWillEnter() {
  const navigation = this.router.getCurrentNavigation();

  if (navigation?.extras?.state?.['customer']) {
    this.customer = navigation.extras.state['customer'];
  }

  if (!this.customer) return;

 
}
Data:any
  loadCustomers() {
    this.isLoading = true;
    this.customerService.getAllCustomerBalance().subscribe(respo=>{
      console.log(respo)
      this.customers = respo
      this.filteredCustomers = [...this.customers]
      this.isLoading = false;
    })
  }

  filterCustomers() {
    if (!this.searchText.trim()) {
      this.filteredCustomers = [...this.customers];
      return;
    }
    
    const search = this.searchText.toLowerCase();
    this.filteredCustomers = this.customers.filter(customer =>
      customer.customer_name.toLowerCase().includes(search) ||
      customer.customer_phone.toLowerCase().includes(search)
    );
  }

  addCustomer() {
    // if (!this.newCustomer.customer_name || !this.newCustomer.customer_phone) {
    //   this.showAlert('Validation Error', 'Please fill in all required fields');
    //   return;
    // }

    // Check for duplicate phone
    // const exists = this.customers.some(c => c.customer_phone === this.newCustomer.customer_phone);
    // if (exists) {
    //   this.showAlert('Error', 'A customer with this phone number already exists');
    //   return;
    // }

    // const customer: Customer = {
    //   customer_id: Date.now().toString(),
    //   ...this.newCustomer,
    //   customer_balance: 0,
    //   customer_createdDate: new Date()
    // };

    // this.customers.push(customer);
    // this.filteredCustomers = [...this.customers];
    // this.resetForm();
    // this.showAlert('Success', `Customer ${customer.customer_name} added successfully`);
  }

  editCustomer(customer: Customer) {
    this.router.navigate(['/auth/edit_customer'], { state: { customer } });
  }

  viewCustomer(customer: Customer) {
    const id = customer.customer_id;
    this.router.navigate(['/auth/customer_view', { id}]);
  }

async deleteCustomer(customer: Customer) {
  const alert = await this.alertController.create({
    header: 'Delete Customer',
    message: `Are you sure you want to delete ${customer.customer_name}?`,
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: 'Delete',
        role: 'destructive',
        handler: () => {
          this.deleteCuseomer(customer); // ✅ CALL DELETE
        }
      }
    ]
  });

  await alert.present();
}


  deleteCuseomer(customer: Customer) {
  this.customerService.deleteCustomer(customer.customer_id).subscribe({
    next: async () => {
      const alert = await this.alertController.create({
        header: 'Success',
        message: `Customer ${customer.customer_name} deleted successfully`,
        buttons: ['OK']
      });
      await alert.present();

      this.loadCustomers(); // 🔄 refresh list
    },
    error: async () => {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Failed to delete customer',
        buttons: ['OK']
      });
      await alert.present();
    }
  });
}
async showToast(message: string) {
 const toast = await this.alertController.create({
   header: 'Notification',
   message,
    buttons: ['OK']
  });
  await toast.present();


}


  resetForm() {
    this.newCustomer = {
      customer_id: '',
      customer_email: '',
      customer_name: '',
      customer_phone: '',
      customer_createdDate: new Date(),
      customer_balance: 0,
      currentbalance: null
    };
  }

  // async showAlert(header: string, message: string) {
  //   const alert = await this.alertController.create({
  //     header,
  //     message,
  //     buttons: ['OK']
  //   });
  //   await alert.present();
  // }
}
