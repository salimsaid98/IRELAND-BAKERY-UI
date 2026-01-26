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
  IonBackButton
} from '@ionic/angular/standalone';

import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { OrderItemsServicesService } from '../services/orderItems/order-items-services.service';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/* =======================
   INTERFACES
======================= */

interface ApiOrderItem {
  order_date: string;
  customer_name: string;
  customer_phone: string;
  name: string;
  price: number;
  quantity: number;
  app_user_id: number;
}

interface OrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Order {
  customer_name: string;
  customer_phone: string;
  date: string;
  order_id?: number;
  status: 'pending' | 'completed' | 'cancelled';
  items: OrderItem[];
  totalAmount: number;
}

interface Customer {
  name: string;
  phone: string;
  email?: string;
}

/* =======================
   COMPONENT
======================= */

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
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
    IonBackButton
  ]
})
export class OrderDetailsPage implements OnInit {

  order_id!: number;

  order: Order = {
    customer_name: '',
    customer_phone: '',
    date: '',
    status: 'completed',
    items: [],
    totalAmount: 0
  };

  customer: Customer = {
    name: '',
    phone: ''
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private orderItemsService: OrderItemsServicesService
  ) {
    const navigation = this.router.getCurrentNavigation();

    if (navigation?.extras?.state?.['customer']) {
      this.customer = navigation.extras.state['customer'];
    }

    this.order_id = Number(this.route.snapshot.params['id']);
  }

  ngOnInit() {
    this.loadOrderData();
  }

  /* =======================
     LOAD ORDER DATA
  ======================= */

  loadOrderData() {
    this.orderItemsService.getOrderItemsByID(this.order_id)
      .subscribe((response: ApiOrderItem[]) => {

        if (!response || response.length === 0) return;

        this.order.date = response[0].order_date;
        this.order.customer_name = response[0].customer_name;
        this.order.customer_phone = response[0].customer_phone;

        this.order.items = response.map(item => ({
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity
        }));

        this.order.totalAmount = this.order.items.reduce(
          (sum, item) => sum + item.totalPrice,
          0
        );

        console.log('Final order:', this.order);
      });
  }

  /* =======================
     HELPERS
  ======================= */

  calculateSubtotal(): number {
    return this.order.items.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  getStatusIcon(): string {
    return this.order.status === 'completed'
      ? 'checkmark-circle'
      : this.order.status === 'pending'
      ? 'time'
      : 'close-circle';
  }

  getStatusDescription(): string {
    return this.order.status === 'completed'
      ? 'This order has been completed successfully'
      : this.order.status === 'pending'
      ? 'This order is awaiting processing'
      : 'This order has been cancelled';
  }

  /* =======================
     ACTIONS
  ======================= */

  editOrder() {
    this.router.navigate(['/auth/edit-order'], {
      state: { order: this.order, customer: this.customer }
    });
  }

  async completeOrder() {
    const alert = await this.alertController.create({
      header: 'Complete Order',
      message: 'Are you sure you want to mark this order as completed?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Complete',
          handler: () => {
            this.order.status = 'completed';
            this.showAlert('Success', 'Order completed successfully');
          }
        }
      ]
    });
    await alert.present();
  }

  async cancelOrder() {
    const alert = await this.alertController.create({
      header: 'Cancel Order',
      message: 'Are you sure you want to cancel this order?',
      buttons: [
        { text: 'No', role: 'cancel' },
        {
          text: 'Yes, Cancel',
          role: 'destructive',
          handler: () => {
            this.order.status = 'cancelled';
            this.showAlert('Cancelled', 'Order has been cancelled');
          }
        }
      ]
    });
    await alert.present();
  }

  /* =======================
     PDF INVOICE
  ======================= */

  downloadInvoice() {
    const doc = new jsPDF();

    doc.setFontSize(16).setFont('helvetica', 'bold');
    doc.text('IRELAND BAKERY', 14, 20);

    doc.setFontSize(10).setFont('helvetica', 'normal');
    doc.text('Phone: +255 713 490 122', 14, 26);
    doc.text('Address: Magomeni Mwembechai', 14, 31);
    doc.text('Dar es Salaam, Tanzania', 14, 36);

    doc.setFontSize(14).setFont('helvetica', 'bold');
    doc.text('INVOICE', 150, 20);

    doc.setFontSize(10).setFont('helvetica', 'normal');
    doc.text(`Invoice No: INV-${this.order_id}`, 150, 26);
    doc.text(
      `Date: ${new Date(this.order.date).toLocaleDateString()}`,
      150,
      31
    );

    doc.setFontSize(12).setFont('helvetica', 'bold');
    doc.text('Bill To:', 14, 60);

    doc.setFontSize(10).setFont('helvetica', 'normal');
    doc.text(`Name: ${this.order.customer_name}`, 14, 66);
    doc.text(`Phone: ${this.order.customer_phone}`, 14, 71);

    autoTable(doc, {
      startY: 80,
      head: [['#', 'Product', 'Qty', 'Unit Price (TZS)', 'Total (TZS)']],
      body: this.order.items.map((item, i) => [
        i + 1,
        item.name,
        item.quantity,
        item.unitPrice.toLocaleString(),
        item.totalPrice.toLocaleString()
      ])
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;

    doc.setFont('helvetica', 'bold');
    doc.text('Total:', 130, finalY);
    doc.text(
      `${this.order.totalAmount.toLocaleString()} TZS`,
      170,
      finalY,
      { align: 'right' }
    );

    doc.save(`Invoice_Order_${this.order_id}.pdf`);
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
