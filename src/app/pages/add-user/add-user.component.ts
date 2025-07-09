import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { ToastNotificationComponent } from '../../shared/toast-notification/toast-notification.component';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, ToastNotificationComponent],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css',
})
export class AddUserComponent {
  users: any[] = [];

  user = {
    UserName: '',
    Password: '',
    Role: 'ADMIN'
  };
  loading = false;
  message = '';
  error = '';
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';
  showToast: boolean = false;
  showPassword: boolean = false;
  passwordStrength: 'weak' | 'medium' | 'strong' = 'weak';
  passwordStrengthPercent: number = 0;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  checkPasswordStrength() {
    const value = this.user.Password || '';
    let score = 0;
    if (value.length >= 6) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;
    if (value.length >= 10) score++;
    if (score <= 2) {
      this.passwordStrength = 'weak';
      this.passwordStrengthPercent = 33;
    } else if (score === 3 || score === 4) {
      this.passwordStrength = 'medium';
      this.passwordStrengthPercent = 66;
    } else {
      this.passwordStrength = 'strong';
      this.passwordStrengthPercent = 100;
    }
  }

  showToastMessage(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 2500);
  }

  constructor(private userService: UserService) {}

  get isAdmin(): boolean {
    return localStorage.getItem('role') === 'admin';
  }

  ngOnInit() {
    if (this.isAdmin) {
      this.userService.getAllUsers().subscribe({
        next: (data) => this.users = data,
        error: () => this.showToastMessage('Failed to load users.', 'error')
      });
    }
  }

  addUser() {
    this.loading = true;
    this.message = '';
    this.error = '';
    if (this.user.Password.length < 6 || this.user.Password.length > 16) {
      this.error = 'Password must be 6-16 characters.';
      this.showToastMessage(this.error, 'error');
      this.loading = false;
      return;
    }
    this.userService.addUser(this.user).subscribe({
      next: () => {
        this.message = 'User added successfully!';
        this.showToastMessage('User added successfully!', 'success');
        this.loading = false;
        this.user = { UserName: '', Password: '', Role: 'ADMIN' };
      },
      error: (err) => {
        this.error = 'Failed to add user.';
        this.showToastMessage('Failed to add user.', 'error');
        this.loading = false;
      }
    });
  }
}
