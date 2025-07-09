import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { StockService } from '../../services/stock.service';
import { Router } from '@angular/router';
import { ToastNotificationComponent } from '../../shared/toast-notification/toast-notification.component';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { EMPTY, catchError } from 'rxjs';

// Match backend DTOs
interface StockCreateDTO {
  bloodGroup: string;
  quantity: number;
}

interface StockUpdateDTO {
  quantity: number;
}

interface StockGetDTO {
  bloodGroup: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ToastNotificationComponent,
    NavbarComponent,
  ],
})
export class StockComponent implements OnInit {
  stocks: StockGetDTO[] = [];
  filteredStocks: StockGetDTO[] = [];
  searchTerm: string = '';
  loading = false;
  error = '';
  message = '';
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';
  showToast: boolean = false;
  stockForm!: FormGroup;
  editMode = false;
  editBloodGroup: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private stockService: StockService
  ) {
    // Initialize form with disabled state
    this.stockForm = this.fb.group({
      bloodGroup: new FormControl('', Validators.required),
      quantity: new FormControl(0, [Validators.required, Validators.min(1)]),
    });
  }

  ngOnInit(): void {
    this.fetchStocks();
  }

  fetchStocks(): void {
    this.loading = true;
    this.error = '';
    console.log('Fetching stocks...');

    this.stockService
      .getAllStocks()
      .pipe(
        catchError((error: any) => {
          console.error('Error fetching stocks:', error);
          this.error = error.error?.message || 'Failed to fetch stocks';
          this.showToastMessage(this.error, 'error');
          this.loading = false;
          return EMPTY;
        })
      )
      .subscribe(
        (data) => {
          console.log('Received data:', data);
          if (data) {
            this.stocks = data;
            this.filterStocks();
            this.loading = false;
          } else {
            console.log('No data received');
            this.stocks = [];
            this.filteredStocks = [];
            this.loading = false;
          }
        },
        (error) => {
          console.error('Error in subscription:', error);
          this.error = error.error?.message || 'Failed to fetch stocks';
          this.showToastMessage(this.error, 'error');
          this.loading = false;
        }
      );
  }

  filterStocks(): void {
    if (!this.stocks || this.stocks.length === 0) {
      this.filteredStocks = [];
      return;
    }

    const term = (this.searchTerm || '').toLowerCase();
    if (!term) {
      this.filteredStocks = [...this.stocks];
    } else {
      this.filteredStocks = this.stocks.filter((s: StockGetDTO) => {
        const bg = (s.bloodGroup || '').toLowerCase();
        return bg.includes(term);
      });
    }
  }

  private showToastMessage(message: string, type: 'success' | 'error'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 2500);
  }

  editStock(stock: StockGetDTO): void {
    if (!stock || !stock.bloodGroup) {
      this.error = 'Invalid stock record';
      this.showToastMessage(this.error, 'error');
      return;
    }

    this.editMode = true;
    this.editBloodGroup = stock.bloodGroup;

    // Set values and disable BloodGroup field
    this.stockForm.patchValue(
      {
        bloodGroup: stock.bloodGroup,
        quantity: stock.quantity,
      },
      { emitEvent: false }
    );

    // Disable BloodGroup field using form control methods
    this.stockForm.get('BloodGroup')?.disable();
    this.stockForm.get('Quantity')?.enable();
  }

  cancelEdit(): void {
    this.editMode = false;
    this.editBloodGroup = '';

    // Reset form and enable BloodGroup field
    this.stockForm.reset(
      {
        bloodGroup: '',
        quantity: 0,
      },
      { emitEvent: false }
    );

    // Enable BloodGroup field using form control methods
    this.stockForm.get('BloodGroup')?.enable();
  }

  deleteStock(bloodGroup: string): void {
    if (!bloodGroup) {
      this.error = 'Invalid blood group';
      this.showToastMessage(this.error, 'error');
      return;
    }

    if (
      !confirm(
        `Are you sure you want to delete stock for blood group ${bloodGroup}?`
      )
    )
      return;

    this.loading = true;
    this.error = '';
    this.stockService.deleteStock(bloodGroup).subscribe({
      next: () => {
        this.showToastMessage('Stock deleted successfully!', 'success');
        this.fetchStocks();
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Failed to delete stock';
        this.showToastMessage(this.error, 'error');
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  submitStock(): void {
    this.loading = true;
    this.error = '';

    if (this.stockForm.invalid) {
      this.stockForm.markAllAsTouched();
      this.error = 'Please fill all required fields correctly.';
      this.showToastMessage(this.error, 'error');
      this.loading = false;
      return;
    }

    const formValue = this.stockForm.value;
    const bloodGroup = formValue.bloodGroup?.toUpperCase() || '';
    const quantity = formValue.quantity;

    if (!bloodGroup || !quantity || quantity <= 0) {
      this.error =
        'Blood group and quantity are required. Quantity must be greater than 0.';
      this.showToastMessage(this.error, 'error');
      this.loading = false;
      return;
    }

    if (this.editMode) {
      const updatePayload: StockUpdateDTO = {
        quantity: quantity,
      };

      this.stockService.updateStock(bloodGroup, updatePayload).subscribe({
        next: () => {
          this.showToastMessage('Stock updated successfully!', 'success');
          this.editMode = false;
          this.editBloodGroup = '';

          // Reset form and enable BloodGroup field
          this.stockForm.reset({ BloodGroup: '', Quantity: 0 });
          this.stockForm.get('BloodGroup')?.enable();

          this.fetchStocks();
        },
        error: (err: any) => {
          this.error = err.error?.message || 'Failed to update stock';
          this.showToastMessage(this.error, 'error');
        },
        complete: () => {
          this.loading = false;
        },
      });
    } else {
      // Check if blood group exists
      const existing = this.stocks.find(
        (s) => s.bloodGroup?.toUpperCase() === bloodGroup
      );
      if (existing) {
        this.error =
          'Blood group already exists. Use the edit functionality to update existing stock.';
        this.showToastMessage(this.error, 'error');
        this.loading = false;
        return;
      }

      const createPayload: StockCreateDTO = {
        bloodGroup: bloodGroup,
        quantity: quantity,
      };

      this.stockService.createStock(createPayload).subscribe({
        next: () => {
          this.showToastMessage('Stock added successfully!', 'success');

          // Reset form
          this.stockForm.reset({ BloodGroup: '', Quantity: 0 });

          this.fetchStocks();
        },
        error: (err: any) => {
          this.error = err.error?.message || 'Failed to create stock';
          this.showToastMessage(this.error, 'error');
        },
        complete: () => {
          this.loading = false;
        },
      });
    }
  }
}
