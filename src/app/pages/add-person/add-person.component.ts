import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonService } from '../../services/person.service';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { ToastNotificationComponent } from '../../shared/toast-notification/toast-notification.component';

@Component({
  selector: 'app-add-person',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NavbarComponent, ToastNotificationComponent],
  templateUrl: './add-person.component.html',
  styleUrl: './add-person.component.css',
})
export class AddPersonComponent {
  addPersonForm: FormGroup;
  message: string = '';
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';
  showToast: boolean = false;

  constructor(private fb: FormBuilder, private personService: PersonService, private router: Router) {
    this.addPersonForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.maxLength(100)
      ]],
      gender: ['', Validators.required],
      bloodGroup: ['', Validators.required],
      address: ['', Validators.required],
      phoneNumber: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern(/^[0-9]{10}$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]]
    });
  }

  addPerson() {
    if (this.addPersonForm.invalid) {
      this.addPersonForm.markAllAsTouched();
      this.showToastMessage('Please fill all required fields correctly.', 'error');
      return;
    }
    // Format the data to match backend DTO
    const payload = this.addPersonForm.value;
    this.personService.addPerson(payload).subscribe({
      next: () => {
        this.showToastMessage('Person added successfully!', 'success');
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1500);
      },
      error: () => {
        this.showToastMessage('Error adding person. Please try again.', 'error');
      }
    });
  }

  showToastMessage(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 2500);
  }

}

