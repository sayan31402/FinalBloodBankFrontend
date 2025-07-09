import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonService } from '../../services/person.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-search-person',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './search-person.component.html',
  styleUrl: './search-person.component.css',
})
export class SearchPersonComponent {
  searchType: 'id' | 'name' | 'bloodGroup' = 'id';
  searchValue: string = '';
  persons: any[] = [];
  loading = false;
  error = '';

  constructor(private personService: PersonService) {}

  search() {
    this.error = '';
    this.persons = [];
    this.loading = true;
    let obs;
    if (this.searchType === 'id') {
      obs = this.personService.getPersonById(Number(this.searchValue));
    } else if (this.searchType === 'name') {
      obs = this.personService.getPersonByName(this.searchValue);
    } else {
      obs = this.personService.getPersonByBloodGroup(this.searchValue);
    }
    obs.subscribe({
      next: (result) => {
        // getPersonById returns an object, others return arrays
        const arr = Array.isArray(result) ? result : result ? [result] : [];
        // Normalize fields for consistent table display
        this.persons = arr.map((p) => ({
          personId: p.personId ?? p.id ?? '',
          name: p.name ?? '',
          bloodGroup: p.bloodGroup ?? '',
          gender: p.gender ?? '',
          address: p.address ?? '',
          countryCode: p.countryCode ?? '91',
          phoneNumber: p.phoneNumber ?? '',
          email: p.email ?? '',
        }));
        this.loading = false;
      },
      error: (err) => {
        this.error = 'No person found or error occurred.';
        this.loading = false;
      },
    });
  }
}
