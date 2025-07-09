import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReceiverService } from '../../services/receiver.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { PersonService } from '../../services/person.service';

import { ToastNotificationComponent } from '../../shared/toast-notification/toast-notification.component';

@Component({
  selector: 'app-receive',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, ToastNotificationComponent],
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.css'],
})
export class ReceiveComponent {
  receiver = {
    personId: '',
    receiverDateTime: '', // ISO string for datetime-local input
    quantity: null,
    hospitalName: '',
    personBloodGroup: '' // Add this property for type safety
  };

  message: string = '';
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

  person: any = null;
  loadingPerson = false;
  personError = '';

  constructor(
    private receiverService: ReceiverService,
    private personService: PersonService,
    private router: Router
  ) {}

  fetchPersonById() {
    if (!this.receiver.personId) return;
    this.loadingPerson = true;
    this.personError = '';
    this.person = null;
    this.personService.getPersonById(Number(this.receiver.personId)).subscribe({
      next: (person) => {
        this.person = person;
        // Set the blood group in the receiver object for backend validation
        this.receiver.personBloodGroup = person.bloodGroup || '';
        this.loadingPerson = false;
      },
      error: () => {
        this.personError = 'Person not found.';
        this.person = null;
        this.loadingPerson = false;
      }
    });
  }

  recordReceive() {
    const receiverDateTime = this.receiver.receiverDateTime
      ? new Date(this.receiver.receiverDateTime).toISOString()
      : '';
    const payload = {
      PersonId: Number(this.receiver.personId),
      ReceiverDateTime: receiverDateTime,
      Quantity: Number(this.receiver.quantity),
      HospitalName: this.receiver.hospitalName,
      PersonBloodGroup: this.receiver.personBloodGroup || '' // Send actual blood group
    };
    this.receiverService.recordReceive(payload).subscribe({
      next: () => {
        this.message = 'Receive record added successfully!';
        this.showToastMessage('Receive record added successfully!', 'success');
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1000);
      },
      error: (err) => {
        this.message = 'Error adding receive record. Please try again.';
        this.showToastMessage(this.message, 'error');
      }
    });
  }
}
