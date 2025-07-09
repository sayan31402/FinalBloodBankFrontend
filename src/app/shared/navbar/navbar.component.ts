import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})

export class NavbarComponent {
  constructor(private router: Router, private authService: AuthService) {}

  get isAdminRole(): boolean {
    return this.authService.getUserRole() === 'admin';
  }

  logout() {
    // Perform logout logic here
    // For example, clear user data and navigate to the login page
    localStorage.removeItem('token'); // Assuming you store an authentication token
    this.router.navigate(['/']); // Navigate to the login page
  }
}
