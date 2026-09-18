import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar.component';
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    HttpClientModule,
     AdminSidebarComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {

  offersCount = 0;
  productsCount = 0;

  private offersApiUrl = 'https://market-kacmoli-backend.onrender.com/api/offers';
  private productsApiUrl = 'https://market-kacmoli-backend.onrender.com/api/products';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadCounts();
  }

  loadCounts(): void {

    // Merr numrin real te ofertave
    this.http.get<any[]>(this.offersApiUrl).subscribe({
      next: (offers) => {
        this.offersCount = offers.length;
      },
      error: (error) => {
        console.error('Gabim ne marrjen e ofertave:', error);
      }
    });

    // Merr numrin real te produkteve
    this.http.get<any[]>(this.productsApiUrl).subscribe({
      next: (products) => {
        this.productsCount = products.length;
      },
      error: (error) => {
        console.error('Gabim ne marrjen e produkteve:', error);
      }
    });

  }

  logout(): void {
    localStorage.removeItem('adminLoggedIn');
    this.router.navigate(['/admin/login']);
  }

}