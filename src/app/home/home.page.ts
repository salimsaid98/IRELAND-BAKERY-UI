import { Component, ViewChild } from '@angular/core';
import { IonicModule, IonModal } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { cart, cartOutline, add, remove, star, search, card, trash } from 'ionicons/icons';
import { ProductServicesService } from '../services/product/product-services.service';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  inStock: boolean;
  quantity: number;
}


interface CartItem extends Product {
  quantity: number;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, 
    FormsModule, 
    CommonModule
  ],
})
export class HomePage {
  @ViewChild('cartModal') cartModal!: IonModal;


  products: Product[] = [
    // {
    //   id: 1,
    //   name: 'Slice',
    //   description: 'bread slicer',
    //   price: 600.00,
    //   originalPrice: 600.00,
    //   image: 'https://via.placeholder.com/300x200?text=Headphones',
    //   rating: 5,
    //   inStock: true,
    //   quantity: 0,
    // },
    // {
    //   id: 2,
    //   name: 'Nana',
    //   description: 'nana bread',
    //   price: 600.00,
    //   originalPrice: 600.00,
    //   image: 'https://via.placeholder.com/300x200?text=SmartWatch',
    //   rating: 4,
    //   inStock: true,
    //   quantity: 0,
    // },
    // {
    //   id: 3,
    //   name: 'Chocolate',
    //   description: 'bread chocolate',
    //   price: 650.00,
    //   image: 'https://via.placeholder.com/300x200?text=Cable',
    //   rating: 4,
    //   inStock: true,
    //   quantity: 0,
    // },
    // {
    //   id: 4,
    //   name: 'Andazi',
    //   description: 'Andazi bread',
    //   price: 800.00,
    //   originalPrice: 800.00,
    //   image: 'https://via.placeholder.com/300x200?text=Speaker',
    //   rating: 5,
    //   inStock: true,
    //   quantity: 0,
    // },
    // {
    //   id: 5,
    //   name: 'Mini',
    //   description: 'mini bread',
    //   price: 600.00,
    //   image: 'https://via.placeholder.com/300x200?text=PhoneCase',
    //   rating: 3,
    //   inStock: false,
    //   quantity: 0,
    // },
    // {
    //   id: 6,
    //   name: 'Screen Protector',
    //   description: 'Tempered glass protection',
    //   price : 60012.99,
    //   image: 'https://via.placeholder.com/300x200?text=ScreenProtector',
    //   rating: 4,
    //   inStock: true,
    //   quantity: 0,
    // },
  ];

  filteredProducts: Product[] = [];
  cartItems: CartItem[] = [];
  searchText: string = '';
  isCartOpen: boolean = false;

  constructor(private router: Router,
    private productData: ProductServicesService
  ) {
    addIcons({ cart, cartOutline, add, remove, star, search, card, trash });
    this.filteredProducts = [...this.products];
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
      this.getAllProducts();
  }

  filterProducts(): void {
    if (!this.searchText.trim()) {
      this.filteredProducts = [...this.products];
    } else {
      const searchLower = this.searchText.toLowerCase();
      this.filteredProducts = this.products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower)
      );
    }
  }

  increaseQuantity(product: Product): void {
    if (product.inStock) {
      product.quantity++;
    }
  }

  decreaseQuantity(product: Product): void {
    if (product.quantity > 0) {
      product.quantity--;
    }
  }

  validateQuantity(product: Product): void {
    if (product.quantity < 0) {
      product.quantity = 0;
    }
  }

  addToCart(product: Product): void {
    if (product.quantity <= 0 || !product.inStock) {
      return;
    }

    const existingItem = this.cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += product.quantity;
    } else {
      this.cartItems.push({
        ...product,
        quantity: product.quantity,
      });
    }

    product.quantity = 0;
  }

  removeFromCart(index: number): void {
    this.cartItems.splice(index, 1);
  }

  increaseCartQuantity(index: number): void {
    if (this.cartItems[index]) {
      this.cartItems[index].quantity++;
    }
  }

  decreaseCartQuantity(index: number): void {
    if (this.cartItems[index] && this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity--;
    }
  }

  openCart(): void {
    this.isCartOpen = true;
  }

  closeCart(): void {
    this.isCartOpen = false;
  }
proceedToCheckout(): void {
  if (this.cartItems.length === 0) {
    return;
  }

  sessionStorage.setItem('cartItems', JSON.stringify(this.cartItems));
  this.closeCart();

  this.router.navigate(['auth/checkout']).then(success => {
    if (success) {
      // Reload page after successful navigation
      window.location.reload();
    }
  }).catch(err => {
    console.error('Navigation error:', err);
  });
}

  get cartSubtotal(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  get cartTax(): number {
    return this.cartSubtotal * 0; // 10% tax
  }

  get cartTotal(): number {
    return this.cartSubtotal + this.cartTax;
  }
  getAllProducts(){
     this.productData.getAllProducts().subscribe(res => {
      this.products = res.map((product: any) => ({
        id: product.product_id,  // Map product_id to id
        name: product.name,
        description: product.description || '',  // Handle empty description
        price: product.selling_price || product.price,  // Use selling_price or fallback to price
        originalPrice: product.originalPrice,
        image: 'http://192.168.1.100:8082' + product.image,  // Prepend base URL for full image path
        rating: product.rating,
        inStock: product.inStock,
        quantity: product.quantity || 0,  // Default quantity if missing
      }));
      this.filteredProducts = [...this.products];
      console.log(this.products);
    });
  }
}