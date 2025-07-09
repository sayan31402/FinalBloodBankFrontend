// src/app/pages/home/home.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { AuthService } from '../../services/auth.service';
import { StockService } from '../../services/stock.service';
import { DonationService } from '../../services/donation.service';
import { ReceiverService } from '../../services/receiver.service';
import { BaseChartDirective } from 'ng2-charts';
import {
  Chart,
  PieController,
  BarController,
  LineController,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
} from 'chart.js';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    FooterComponent,
    BaseChartDirective,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  public userRole: string | null = null;
  public selectedChart: 'pie' | 'bar' | 'line' | 'doughnut' = 'pie';
  public donationCount: number = 0;
  public receiveCount: number = 0;

  // Bar chart config
  public barChartData: import('chart.js').ChartData<'bar', number[], string> = {
    labels: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    datasets: [
      {
        label: 'Blood Stock',
        data: [0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#C9CBCF',
          '#E7E9ED',
        ],
      },
    ],
  };
  public barChartType: import('chart.js').ChartType = 'bar';

  // Line chart config (Donations per month)
  public lineChartData: import('chart.js').ChartData<'line', number[], string> =
    {
      labels: [],
      datasets: [
        {
          label: 'Donations per Month',
          data: [],
          borderColor: '#36A2EB',
          backgroundColor: 'rgba(54,162,235,0.2)',
          tension: 0.3,
          fill: true,
        },
      ],
    };
  public lineChartType: import('chart.js').ChartType = 'line';

  // Doughnut chart config (Receives by Blood Group)
  public doughnutChartData: import('chart.js').ChartData<
    'doughnut',
    number[],
    string
  > = {
    labels: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#C9CBCF',
          '#E7E9ED',
        ],
      },
    ],
  };
  public doughnutChartType: import('chart.js').ChartType = 'doughnut';

  public pieChartData: import('chart.js').ChartData<'pie', number[], string> = {
    labels: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0, 0, 0], // Will be replaced with real data
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#C9CBCF',
          '#E7E9ED',
        ],
      },
    ],
  };

  public pieChartType: import('chart.js').ChartType = 'pie';

  constructor(
    public authService: AuthService,
    private stockService: StockService,
    private donationService: DonationService,
    private receiverService: ReceiverService
  ) {
    Chart.register(
      PieController,
      BarController,
      LineController,
      DoughnutController,
      ArcElement,
      Tooltip,
      Legend,
      CategoryScale
    );
  }

  ngOnInit(): void {
    // Get user role (from AuthService or localStorage)
    this.userRole = localStorage.getItem('role');
    this.stockService.getAllStocks().subscribe({
      next: (stocks: any[]) => {
        // Map backend stock data to blood group order
        const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        const data = bloodGroups.map((bg) => {
          const entry = stocks.find(
            (s) => (s.bloodGroup || s.BloodGroup) === bg
          );
          return entry ? entry.quantity || entry.Quantity || 0 : 0;
        });
        this.pieChartData = {
          ...this.pieChartData,
          datasets: [
            {
              ...this.pieChartData.datasets[0],
              data,
            },
          ],
        };
        this.barChartData = {
          ...this.barChartData,
          datasets: [
            {
              ...this.barChartData.datasets[0],
              data,
            },
          ],
        };
      },
      error: (err) => {
        // Optionally handle error
        console.error('Failed to fetch stock data:', err);
      },
    });

    // Fetch staff/admin-only stats
    if (this.userRole === 'Staff' || this.userRole === 'Admin') {
      // Donations: count and line chart (per month)
      this.donationService.getAllDonations().subscribe({
        next: (donations: any[]) => {
          this.donationCount = donations.length;
          // Group by month
          const monthMap: { [key: string]: number } = {};
          donations.forEach((d) => {
            const date = new Date(d.donationDate || d.DonationDate);
            const label = `${date.getFullYear()}-${(
              '0' +
              (date.getMonth() + 1)
            ).slice(-2)}`;
            monthMap[label] = (monthMap[label] || 0) + 1;
          });
          const sortedMonths = Object.keys(monthMap).sort();
          this.lineChartData = {
            ...this.lineChartData,
            labels: sortedMonths,
            datasets: [
              {
                ...this.lineChartData.datasets[0],
                data: sortedMonths.map((m) => monthMap[m]),
              },
            ],
          };
        },
        error: (err) => console.error('Failed to fetch donations', err),
      });
      // Receives: count and doughnut chart (by blood group)
      this.receiverService.getAllReceivers().subscribe({
        next: (receives: any[]) => {
          this.receiveCount = receives.length;
          const bloodGroups = [
            'A+',
            'A-',
            'B+',
            'B-',
            'AB+',
            'AB-',
            'O+',
            'O-',
          ];
          const groupCount = bloodGroups.map(
            (bg) =>
              receives.filter((r) => (r.bloodGroup || r.BloodGroup) === bg)
                .length
          );
          this.doughnutChartData = {
            ...this.doughnutChartData,
            datasets: [
              {
                ...this.doughnutChartData.datasets[0],
                data: groupCount,
              },
            ],
          };
        },
        error: (err) => console.error('Failed to fetch receives', err),
      });
    }
  }
}
