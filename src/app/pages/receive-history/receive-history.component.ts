import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReceiverService } from '../../services/receiver.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-receive-history',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './receive-history.component.html',
  styleUrl: './receive-history.component.css',
})
export class ReceiveHistoryComponent implements OnInit {
  receivers: any[] = [];
  loading = true;
  error: string = '';

  constructor(private receiverService: ReceiverService) {}

  ngOnInit() {
    this.receiverService.getAllReceivers().subscribe({
      next: (data) => {
        this.receivers = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load receiver records.';
        this.loading = false;
      },
    });
  }
}
