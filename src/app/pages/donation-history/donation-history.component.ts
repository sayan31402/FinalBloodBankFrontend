import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonationService } from '../../services/donation.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { ToastNotificationComponent } from '../../shared/toast-notification/toast-notification.component';
import { DonationDTO } from '../../services/donation.service';

@Component({
  selector: 'app-donation-history',
  standalone: true,
  imports: [CommonModule, NavbarComponent, ToastNotificationComponent],
  templateUrl: './donation-history.component.html',
  styleUrls: ['./donation-history.component.css'],
})
export class DonationHistoryComponent implements OnInit {
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';
  showToast: boolean = false;

  showToastMessage(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 2500);
  }

  donations: DonationDTO[] = [];
  loading = true;
  error: string = '';

  constructor(private donationService: DonationService) {}

  ngOnInit() {
    this.donationService.getAllDonations().subscribe({
      next: (donations) => {
        this.donations = donations;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load donation records.';
        this.loading = false;
      },
    });
  }
}
