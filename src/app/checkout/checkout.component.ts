import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, IonModal, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { card, cash, person, add, checkmarkCircle, today } from 'ionicons/icons';
import { CustomerServicesService } from '../services/customer/customer-services.service';
import { OrderServicesService } from '../services/order/order-services.service';
import { OrderItemsServicesService } from '../services/orderItems/order-items-services.service';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
}

interface orderItemModel {
   order_items_id:any
    order_id:any
    product_id:any
    quantity:any
    price:any
}
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class CheckoutComponent implements OnInit {
  @ViewChild('addCustomerModal') addCustomerModal!: IonModal;
  id:any
  cartItems: CartItem[] = [];
  customers: Customer[] = [];
  paymentMethod: string = 'cash';
  selectedCustomer: Customer | null = null;
  showAddCustomerForm: boolean = false;

  checkoutForm!: FormGroup;
  customerForm!: FormGroup;

  cartSubtotal: number = 0;
  cartTax: number = 0;
  cartTotal: number = 0;

  isProcessing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastController: ToastController,
    private customerService: CustomerServicesService,
    private orderService: OrderServicesService,
    private orderItemsService: OrderItemsServicesService
  ) {
    addIcons({ card, cash, person, add, checkmarkCircle });
    this.initializeForms();
    this.loadSampleCustomers();
  }

  ngOnInit() {
    this.loadCartData();
  }

  initializeForms(): void {
    this.checkoutForm = this.fb.group({
      paymentMethod: ['cash', Validators.required],
      customerId: [''],
      notes: [''],
    });

    this.customerForm = this.fb.group({
      customer_name: ['', [Validators.required, Validators.minLength(2)]],
      customer_phone: ['', [Validators.required, Validators.pattern(/^[0-9\-\+\(\)\s]+$/)]],
      // email: ['', [Validators.required, Validators.email]],
      customer_balance: ['', [Validators.required, Validators.pattern(/^[0-9\-\+\(\)\s]+$/)]],
    });
  }

  loadCartData(): void {
    // Get cart data from localStorage or session
    const cartData = sessionStorage.getItem('cartItems');
    if (cartData) {
      this.cartItems = JSON.parse(cartData);
      this.calculateTotals();
    } else {
      // Fallback: use router navigation extras
      const navigation = this.router.getCurrentNavigation();
      if (navigation?.extras?.state?.['cartItems']) {
        this.cartItems = navigation.extras.state['cartItems'];
        this.calculateTotals();
      }
    }
  }

  loadSampleCustomers(): void {
    // Load customers from localStorage or use sample data
    // const customersData = localStorage.getItem('customers');
    // if (customersData) {
    //   this.customers = JSON.parse(customersData);
    // } else {
    //   this.customers = [
    //     {
    //       id: 1,
    //       name: 'John Doe',
    //       phone: '123-456-7890',
    //       email: 'john@example.com',
    //       address: '123 Main St, City, State',
    //     },
    //     {
    //       id: 2,
    //       name: 'Jane Smith',
    //       phone: '098-765-4321',
    //       email: 'jane@example.com',
    //       address: '456 Oak Ave, Town, State',
    //     },
    //   ];
    //   this.saveCustomers();
    // }
    this.customerService.getAllCustomer().subscribe((respo) => {
      respo.forEach((element: any) => {
        this.customers.push({
          id: element.customer_id,
          name: element.customer_name,
          phone: element.customer_phone,
          email: element.customer_email,
          address: element.customer_address,
        });
      });
    });
  }

  saveCustomers(): void {
    this.customerService.createCustomer(this.customerForm.value).subscribe((respo) => {
      console.log('Customer saved successfully', respo);
      this.customers.push({
        id: respo.customer_id,
        name: respo.customer_name,    
        phone: respo.customer_phone,
        email: respo.customer_email,
        address: respo.customer_address,
      });
      this.loadSampleCustomers();
      this.showToast('Customer added successfully!', 'success');
      location.reload();
      this.selectCustomer(respo.customer_id);
    });
    // localStorage.setItem('customers', JSON.stringify(this.customers));
    // console.log('Customers saved', this.customerForm.value);
  }

  calculateTotals(): void {
    this.cartSubtotal = this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    this.cartTax = this.cartSubtotal * 0;
    this.cartTotal = this.cartSubtotal + this.cartTax;
  }

  onPaymentMethodChange(method: string): void {
    this.paymentMethod = method;
    this.checkoutForm.patchValue({ paymentMethod: method });

    if (method === 'credit') {
      this.checkoutForm.patchValue({ customerId: '' });
      this.selectedCustomer = null;
    }
  }

  selectCustomer(customerId: string): void {
    const customer = this.customerService.getAllCustomer().subscribe((respo) => {
      respo.forEach((element: any) => {
        if (element.customer_id == customerId) {    
          this.selectedCustomer = {
            id: element.customer_id,
            name: element.customer_name,  
            phone: element.customer_phone,
            email: element.customer_email,
            address: element.customer_address,
          };
          this.checkoutForm.patchValue({ customerId });
        }
      });
    });

    // if (customer) {
    //   this.selectedCustomer = customer;
    //   this.checkoutForm.patchValue({ customerId });
    // }
  }

  openAddCustomerModal(): void {
    this.customerForm.reset();
    this.addCustomerModal.present();
  }

  closeAddCustomerModal(): void {
    this.addCustomerModal.dismiss();
  }

  addNewCustomer(): void {
    if (this.customerForm.invalid) {
      this.showToast('Please fill all required fields', 'warning');
      return;
    }

    const newCustomer: Customer = {
      id: Math.max(...this.customers.map((c) => c.id), 0) + 1,
      ...this.customerForm.value,
    };

    this.customers.push(newCustomer);
    this.saveCustomers();

    this.selectedCustomer = newCustomer;
    this.checkoutForm.patchValue({ customerId: newCustomer.id.toString() });

    this.showToast('Customer added successfully!', 'success');
    this.closeAddCustomerModal();
  }

  async completeCheckout(): Promise<void> {
    if (this.cartItems.length === 0) {
      this.showToast('Your cart is empty', 'warning');
      return;
    }

    if (this.paymentMethod === 'credit' && !this.selectedCustomer) {
      this.showToast('Please select or add a customer for credit payment', 'warning');
      return;
    }

    this.isProcessing = true;
    // Simulate processing delay
    setTimeout(() => {
      const order = {
        //  id: Math.floor(Math.random() * 100000),
        order_id: '',
        subtotal: this.cartSubtotal,
        tax: this.cartTax,
        total_amount: this.cartTotal,
        paymentMethod: this.paymentMethod === 'cash' ? 'cash' : 'credit',
        // customer: this.paymentMethod === 'credit' ? this.selectedCustomer : null,
        customer_id: this.selectedCustomer?.id,
        // notes: this.checkoutForm.value.notes,
        order_date: new Date().toISOString().split('T')[0], // ✅ FIX,
        app_user_id: localStorage.getItem('app_user_id')
      };

      // const orderItems: orderItemModel[] = this.cartItems.map(item => ({
      //   order_items_id: null,
      //   order_id: null,          // assign after order is saved
      //   product_id: item.id,     // ✅ correct field name
      //   quantity: item.quantity,
      //   price: item.price
        
      // }));


 const itemData: orderItemModel[] = [];

this.cartItems.forEach(item => {
  itemData.push({
    order_items_id: null,
    product_id: item.id,
    // product_name: item.name,
    order_id: order.order_id,
    price: item.price,
    quantity: item.quantity
  });
  console.log('Order Item Data:', itemData)
});




    
      
      // Save order to localStorage

      // this.orderService.create_Order(order).subscribe(res => {
      //   console.log("Order created successfully", res);
      // });
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push(order);

      this.orderService.create_Order(order).subscribe((res) => {
        console.log('Order created successfully', res);
        itemData.forEach(item => {
          item.order_id = res.order_id;
          this.id = item.order_id; // Assuming the response contains the new order ID
          console.log('Updated Order Item with Order ID:', this.id)
        });
        this.orderItemsService.create_Order(itemData).subscribe((respo) => {
          console.log('Order items created successfully', respo);
        }); 
          // console.log('Order saved:', order);
          const data ={
            order_items_id: null,
            product_id: itemData[0].product_id,
    // product_name: item.name,
            order_id: itemData[0].order_id,
            price: itemData[0].price,
            quantity: itemData[0].quantity
          }
        //    this.orderItemsService.create_Order(data).subscribe((respo) => {
        //   console.log('Order items created successfully', respo);
        // }); 
        
          console.log('Order Items:', data);
      });
      // localStorage.setItem('orders', JSON.stringify(orders));
      // console.log('Order saved:', order);
     

//         this.cartItems.forEach(item => {
//         const obj = {
//           product_id: item.id,
//           product_name: item.name,
//           order_id: order.order_id,
//           price: item.price,
//           quantity: item.quantity
//         };

//        console.log(obj);
// });

      this.isProcessing = false;
      this.showToast(`Order #${this.id} completed successfully!`, 'success');

      // Clear cart
      sessionStorage.removeItem('cartItems');

      // Navigate to home after delay
      setTimeout(() => {
        this.router.navigate(['/auth/home']);
      }, 1500);
    }, 1500);
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

  goBack(): void {
    this.router.navigate(['/auth/home']);
  }
}
