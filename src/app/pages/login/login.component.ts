import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastNotificationComponent } from '../../shared/toast-notification/toast-notification.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastNotificationComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';
  showToast: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  // The backend should return: { success: true, token: '...' }
  login() {
    this.errorMessage = '';
    this.authService.login(this.username, this.password).subscribe({
      next: (result: any) => {
        if (result.token) {
          localStorage.setItem('token', result.token);
          if (result.role) {
            localStorage.setItem('role', result.role.toLowerCase());
          }
          this.errorMessage = '';
          this.showToastMessage('Login successful!', 'success');
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 1000);
        } else {
          this.errorMessage = result.message || 'Invalid credentials';
          this.showToastMessage(this.errorMessage, 'error');
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Login failed. Please try again.';
        this.showToastMessage(this.errorMessage, 'error');
      },
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
