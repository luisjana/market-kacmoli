import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface CatalogImage {
  id: number;
  imageUrl: string;
  publicId: string;
  position: number;
}

interface Catalog {
  id: number;
  title: string;
  updatedAt: string;
  images: CatalogImage[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  catalogs: Catalog[] = [];

  private catalogApiUrl = 'https://market-kacmoli-backend.onrender.com/api/catalog';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCatalogs();
  }

  loadCatalogs(): void {
    this.http.get<Catalog[]>(this.catalogApiUrl).subscribe({
      next: (data) => {
        // Trego vetem 3 kataloget e para si preview
        this.catalogs = data.slice(0, 3);
      },
      error: (error) => {
        console.error('Gabim ne marrjen e katalogeve:', error);
      }
    });
  }

}