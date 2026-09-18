import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent implements OnInit {

  catalogs: Catalog[] = [];
  loading = false;

  selectedCatalog: Catalog | null = null;
  currentImageIndex = 0;

  private apiUrl = 'https://market-kacmoli-backend.onrender.com/api/catalog';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCatalogs();
  }

  loadCatalogs(): void {
    this.loading = true;

    this.http.get<Catalog[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.loading = false;
        this.catalogs = data;
      },
      error: (error) => {
        this.loading = false;
        console.error('Gabim ne marrjen e katalogeve:', error);
      }
    });
  }

  openCatalog(catalog: Catalog): void {
    this.selectedCatalog = catalog;
    this.currentImageIndex = 0;
  }

  closeCatalog(): void {
    this.selectedCatalog = null;
  }

  nextImage(): void {
    if (!this.selectedCatalog) return;

    this.currentImageIndex =
      (this.currentImageIndex + 1) % this.selectedCatalog.images.length;
  }

  prevImage(): void {
    if (!this.selectedCatalog) return;

    this.currentImageIndex =
      (this.currentImageIndex - 1 + this.selectedCatalog.images.length) %
      this.selectedCatalog.images.length;
  }

}