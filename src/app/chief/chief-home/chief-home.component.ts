import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { cube, checkmarkCircle, refresh } from 'ionicons/icons';
import { UnitTypeServicesService } from 'src/app/services/unit_type/unit-type-services.service';
import { ProductionServicesService } from 'src/app/services/production/production-services.service';

interface ProductUnit {
  product_id: number;
  unit_type_id: number;
  name: string;
  unit_measure: number;
  total: number;
}

@Component({
  selector: 'app-chief-home',
  templateUrl: './chief-home.component.html',
  styleUrls: ['./chief-home.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class ChiefHomeComponent implements OnInit {
  productionForm!: FormGroup;
  productUnits: ProductUnit[] = [];
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private unitTypeService: UnitTypeServicesService,
    private productionService: ProductionServicesService
  ) {
    addIcons({ cube, checkmarkCircle, refresh });
    this.initializeForm();
  }

  ngOnInit() {
    this.loadAllUnitTypes();
  }

  initializeForm(): void {
    this.productionForm = this.fb.group({
      product_id: ['', [Validators.required]],
      unit_measure: [0, [Validators.required, Validators.min(1)]],
      app_user_id: [localStorage.getItem('app_user_id') || ''],
      // total_unit_produce: [0]
      
    });
  }
totalproduction: number = 0;
  loadAllUnitTypes(): void {
    this.unitTypeService.getAll().subscribe({
      next: (res: ProductUnit[]) => {
        this.productUnits = res;
    
        console.log('All product units:', this.productUnits);
      },
      error: (err) => {
        console.error('Failed to load product units:', err);
        this.showToast('Failed to load products', 'danger');
      }
    });
  }

  formDataComplete(): boolean {
    return (
      !!this.productionForm.get('product_id')?.value &&
      Number(this.productionForm.get('unit_measure')?.value) > 0
    );
  }

  getSelectedProductName(): string {
    const productId = Number(this.productionForm.get('product_id')?.value);
    const product = this.productUnits.find(p => p.product_id === productId);
    return product ? product.name : 'N/A';
  }

  getTotal(): number {
    const productId = Number(this.productionForm.get('product_id')?.value);
    const inputQuantity = Number(this.productionForm.get('unit_measure')?.value) || 0;
    const product = this.productUnits.find(p => p.product_id === productId);
    const total = product ? product.unit_measure * inputQuantity : 0;
    return total;
  }



  async submitProduction(): Promise<void> {
    if (this.productionForm.invalid) {
      this.showToast('Please select product and enter unit measure', 'warning');
      return;
    }

    this.isSubmitting = true;

    const loading = await this.loadingController.create({
      spinner: 'crescent',
      message: 'Recording production...',
      backdropDismiss: false
    });
    await loading.present();

    const productionData = this.productionForm.value;
    const total_unit_produce = this.getTotal();
    const quantity = Number(this.productionForm.get('unit_measure')?.value) || 0;
    productionData.quantity = quantity;
    productionData.total_unit_produce = total_unit_produce;
    // add current local date-time in format YYYY-MM-DDTHH:mm:ss to match Java LocalDateTime
    productionData.productionDate = new Intl.DateTimeFormat('sv-SE', {
      timeZone: 'Africa/Dar_es_Salaam',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date()).replace(' ', 'T');

    const selectedProduct = this.productUnits.find(p => p.product_id === Number(productionData.product_id));
    productionData.unit_type_id = selectedProduct ? selectedProduct.unit_type_id : null;
    console.log('Production data to submit:', productionData);
    console.log('Selected unit_type_id:', productionData.unit_type_id);

    // Simulate API call
    setTimeout(async () => {
      try {
        // TODO: Replace with actual production service call
        // this.productionService.createProduction(productionData).subscribe({...});
        this.productionService.createProduction(productionData).subscribe(
          async resp=>{
            console.log('Production recorded successfully:', resp);
            await loading.dismiss();
            this.isSubmitting = false;
            this.showToast('Production recorded successfully!', 'success');
            this.resetForm();
            setTimeout(() => {
          this.router.navigate(['/auth/list_production']);
        }, 120);
          }
        )
        
        
     
      } catch (error) {
        await loading.dismiss();
        this.isSubmitting = false;
        console.error('Error:', error);
        this.showToast('Failed to record production', 'danger');
      }
    }, 2000);
  }

  resetForm(): void {
    this.productionForm.reset({
      app_user_id: localStorage.getItem('app_user_id')
    });
  }

  private async showToast(
    message: string,
    color: 'success' | 'warning' | 'danger' | 'primary' = 'primary'
  ): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 120,
      position: 'bottom',
      color
    });
    await toast.present();
  }
  
}
