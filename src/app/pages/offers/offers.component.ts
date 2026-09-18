import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Offer {
  id: number;
  name: string;
  oldPrice: number;
  newPrice: number;
  discount: number;
  image: string;
}

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    HttpClientModule
  ],
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.css'
})
export class OffersComponent implements OnInit {

  offers: Offer[] = [];

  apiUrl = 'https://market-kacmoli-backend.onrender.com/api/offers';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadOffers();
  }

  loadOffers(): void {
    this.http.get<Offer[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.offers = data;
      },
      error: (error) => {
        console.error('Gabim ne marrjen e ofertave:', error);
      }
    });
  }

}