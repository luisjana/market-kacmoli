import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {

  selectedCategory = 'Të gjitha';

  apiUrl = 'https://market-kacmoli-backend.onrender.com/api/products';

  categories: string[] = [
    'Të gjitha',
    'Fruta & Perime',
    'Bulmet',
    'Pije',
    'Ushqime',
    'Mish & Sallamra',
    'Produkte Shtëpie',
    'Kujdes Personal',
    'Ëmbëlsira & Snacks'
  ];

  products: Product[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.http.get<Product[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (error) => {
        console.error('Gabim ne marrjen e produkteve:', error);
      }
    });
  }

  get filteredProducts(): Product[] {

    if (this.selectedCategory === 'Të gjitha') {
      return this.products;
    }

    return this.products.filter(
      product => product.category === this.selectedCategory
    );
  }

  filterProducts(category: string): void {
    this.selectedCategory = category;
  }

}