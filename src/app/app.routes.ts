import { provideRouter, Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { AddPersonComponent } from './pages/add-person/add-person.component';
import { SearchPersonComponent } from './pages/search-person/search-person.component';
import { DonationComponent } from './pages/donation/donation.component';
import { ReceiveComponent } from './pages/receive/receive.component';
import { StockComponent } from './pages/stock/stock.component';
import { DonationHistoryComponent } from './pages/donation-history/donation-history.component';
import { ReceiveHistoryComponent } from './pages/receive-history/receive-history.component';
import { AddUserComponent } from './pages/add-user/add-user.component';

import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent }, // Default route
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    canActivate: [AuthGuard], // Protecting route
  },
  {
    path: 'add-person',
    loadComponent: () =>
      import('./pages/add-person/add-person.component').then(
        (m) => m.AddPersonComponent
      ),
    canActivate: [AuthGuard], // Protecting route
  }, // Protecting route
  {
    path: 'search-person',
    component: SearchPersonComponent,
    canActivate: [AuthGuard],
  }, // Protecting route
  { path: 'donation', component: DonationComponent, canActivate: [AuthGuard] }, // Protecting route
  { path: 'receive', component: ReceiveComponent, canActivate: [AuthGuard] }, // Protecting route
  { path: 'stock', component: StockComponent, canActivate: [AuthGuard] }, // Uncomment if needed
  {
    path: 'donation-history',
    component: DonationHistoryComponent,
    canActivate: [AuthGuard],
  }, // Protecting route
  {
    path: 'receive-history',
    component: ReceiveHistoryComponent,
    canActivate: [AuthGuard],
  }, // Protecting route
  { path: 'add-user', component: AddUserComponent, canActivate: [AuthGuard] }, // Protecting route
  { path: '**', redirectTo: '' }, // Wildcard route for a 404 page or redirect to home
];

export const appRouting = provideRouter(routes);
