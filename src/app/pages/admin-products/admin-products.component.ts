import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar.component';
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
}

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    HttpClientModule,
    AdminSidebarComponent],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css'
})
export class AdminProductsComponent implements OnInit {

  showForm = false;
  editingId: number | null = null;

  apiUrl = 'https://market-kacmoli-backend.onrender.com/api/products';
  uploadUrl = 'https://market-kacmoli-backend.onrender.com/api/images/upload';

  products: Product[] = [];

  categories: string[] = [
    'Fruta & Perime',
    'Bulmet',
    'Pije',
    'Ushqime',
    'Mish & Sallamra',
    'Produkte Shtëpie',
    'Kujdes Personal',
    'Ëmbëlsira & Snacks'
  ];

  formData = {
    name: '',
    category: '',
    price: null as number | null,
    image: ''
  };

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

  openAddForm(): void {
    this.editingId = null;
    this.resetForm();
    this.showForm = true;
  }

  editProduct(product: Product): void {
    this.editingId = product.id;

    this.formData = {
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image
    };

    this.showForm = true;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    const uploadData = new FormData();
    uploadData.append('file', file);

    this.http.post(
      this.uploadUrl,
      uploadData,
      {
        responseType: 'text'
      }
    ).subscribe({
      next: (imagePath) => {
        this.formData.image =
          'https://market-kacmoli-backend.onrender.com' + imagePath;
      },
      error: (error) => {
        console.error('Gabim gjate upload-it te fotos:', error);
      }
    });
  }

  saveProduct(): void {

    if (
      !this.formData.name ||
      !this.formData.category ||
      this.formData.price === null ||
      !this.formData.image
    ) {
      return;
    }

    const productData = {
      name: this.formData.name,
      category: this.formData.category,
      price: this.formData.price,
      image: this.formData.image
    };

    if (this.editingId !== null) {

      this.http.put<Product>(
        `${this.apiUrl}/${this.editingId}`,
        productData
      ).subscribe({
        next: () => {
          this.loadProducts();
          this.closeForm();
        },
        error: (error) => {
          console.error('Gabim ne editimin e produktit:', error);
        }
      });

    } else {

      this.http.post<Product>(
        this.apiUrl,
        productData
      ).subscribe({
        next: () => {
          this.loadProducts();
          this.closeForm();
        },
        error: (error) => {
          console.error('Gabim ne shtimin e produktit:', error);
        }
      });

    }
  }

  deleteProduct(id: number): void {

    const confirmed = confirm(
      'A jeni i sigurt qe doni ta fshini kete produkt?'
    );

    if (!confirmed) {
      return;
    }

    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.loadProducts();
      },
      error: (error) => {
        console.error('Gabim ne fshirjen e produktit:', error);
      }
    });
  }

  closeForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.resetForm();
  }

  resetForm(): void {
    this.formData = {
      name: '',
      category: '',
      price: null,
      image: ''
    };
  }

}