import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DonationService } from '../../services/donation.service';
import { PersonService } from '../../services/person.service';
import { DonationDTO } from '../../services/donation.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { ToastNotificationComponent } from '../../shared/toast-notification/toast-notification.component';

@Component({
  selector: 'app-donation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    ToastNotificationComponent,
  ],
  templateUrl: './donation.component.html',
  styleUrls: ['./donation.component.css'],
})
export class DonationComponent {
  donation: DonationDTO = {
    personId: 0,
    personBloodGroup: '',
    quantity: 0,
    donationDateTime: Date.now().toString(),
    rbcCount: null,
    wbcCount: null,
    plateletCount: null,
  };
  message: string = '';
  person: any = null;
  loadingPerson = false;
  personError = '';
  loading = false;
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  successMessage = '';
  error = '';

  constructor(
    private donationService: DonationService,
    private personService: PersonService,
    public router: Router
  ) {}

  fetchPersonById() {
    if (this.donation.personId) {
      this.loadingPerson = true;
      this.personService.getPersonById(this.donation.personId).subscribe({
        next: (person) => {
          this.person = person;
          this.donation.personBloodGroup = person.bloodGroup;
          this.loadingPerson = false;
        },
        error: () => {
          this.personError = 'Person not found.';
          this.person = null;
          this.donation.personBloodGroup = '';
          this.loadingPerson = false;
        },
      });
    }
  }

  recordDonation() {
    if (
      !this.donation.personId ||
      !this.donation.quantity ||
      !this.donation.donationDateTime
    ) {
      this.showToastMessage('Please fill in all required fields', 'error');
      return;
    }

    // Format the date to ISO string before sending
    const formattedDonation = {
      ...this.donation,
      donationDateTime: new Date(this.donation.donationDateTime).toISOString(),
    };

    this.loading = true;
    this.error = '';
    this.successMessage = '';

    this.donationService.recordDonation(formattedDonation).subscribe({
      next: (response) => {
        console.log('Response:', response);
        this.showToastMessage('Donation recorded successfully', 'success');
        // Reset form and clear person info
        this.donation = {
          personId: 0,
          personBloodGroup: '',
          quantity: 0,
          donationDateTime: Date.now().toString(),
          rbcCount: null,
          wbcCount: null,
          plateletCount: null,
        };
        this.person = null;
        this.personError = '';
        this.loadingPerson = false;
        this.loading = false;
        // Force page refresh after a short delay to ensure the toast notification is visible
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      },
      error: (error) => {
        console.error('Error:', error);
        this.showToastMessage(
          'Error recording donation: ' + error.message || 'Unknown error',
          'error'
        );
        this.loading = false;
      },
    });
  }

  showToastMessage(message: string, type: 'success' | 'error') {
    if (type === 'success') {
      this.successMessage = message;
      this.showToast = false;
    } else {
      this.toastMessage = message;
      this.toastType = type;
      this.showToast = true;
    }
    setTimeout(() => {
      if (type === 'success') {
        this.successMessage = '';
      } else {
        this.showToast = false;
      }
    }, 3000);
  }
}
