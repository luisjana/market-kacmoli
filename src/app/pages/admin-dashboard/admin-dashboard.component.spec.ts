import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly offersUrl = 'https://market-kacmoli-backend.onrender.com/api/offers';
  private readonly productsUrl = 'https://market-kacmoli-backend.onrender.com/api/products';

  offersCount: number = 0;
  productsCount: number = 0;

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    // Marrja e numrit të ofertave
    this.http.get<any[]>(this.offersUrl).subscribe({
      next: (data) => (this.offersCount = data.length),
      error: (err) => console.error('Gabim gjatë marrjes së ofertave:', err)
    });

    // Marrja e numrit të produkteve
    this.http.get<any[]>(this.productsUrl).subscribe({
      next: (data) => (this.productsCount = data.length),
      error: (err) => console.error('Gabim gjatë marrjes së produkteve:', err)
    });
  }

  logout(): void {
    // Fshirja e token-it ose session-it nëse përdorni Auth
    localStorage.removeItem('token');
    
    // Ridrejtimi te faqja e login-it ose faqja kryesore
    this.router.navigate(['/admin/login']);
  }
}