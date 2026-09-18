import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar.component';
interface Offer {
  id: number;
  name: string;
  oldPrice: number;
  newPrice: number;
  discount: number;
  image: string;
}

@Component({
  selector: 'app-admin-offers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    HttpClientModule,
    AdminSidebarComponent],
  templateUrl: './admin-offers.component.html',
  styleUrl: './admin-offers.component.css'
})
export class AdminOffersComponent implements OnInit {

  showForm = false;
  editingId: number | null = null;

  apiUrl = 'https://market-kacmoli-backend.onrender.com/api/offers';
  uploadUrl = 'https://market-kacmoli-backend.onrender.com/api/images/upload';

  offers: Offer[] = [];

  formData = {
    name: '',
    oldPrice: null as number | null,
    newPrice: null as number | null,
    discount: null as number | null,
    image: ''
  };

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

  openAddForm(): void {
    this.editingId = null;
    this.resetForm();
    this.showForm = true;
  }

  editOffer(offer: Offer): void {
    this.editingId = offer.id;

    this.formData = {
      name: offer.name,
      oldPrice: offer.oldPrice,
      newPrice: offer.newPrice,
      discount: offer.discount,
      image: offer.image
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

  saveOffer(): void {

    if (
      !this.formData.name ||
      this.formData.oldPrice === null ||
      this.formData.newPrice === null ||
      this.formData.discount === null ||
      !this.formData.image
    ) {
      return;
    }

    const offerData = {
      name: this.formData.name,
      oldPrice: this.formData.oldPrice,
      newPrice: this.formData.newPrice,
      discount: this.formData.discount,
      image: this.formData.image
    };

    if (this.editingId !== null) {

      this.http.put<Offer>(
        `${this.apiUrl}/${this.editingId}`,
        offerData
      ).subscribe({
        next: () => {
          this.loadOffers();
          this.closeForm();
        },
        error: (error) => {
          console.error('Gabim ne editimin e ofertes:', error);
        }
      });

    } else {

      this.http.post<Offer>(
        this.apiUrl,
        offerData
      ).subscribe({
        next: () => {
          this.loadOffers();
          this.closeForm();
        },
        error: (error) => {
          console.error('Gabim ne shtimin e ofertes:', error);
        }
      });

    }
  }

  deleteOffer(id: number): void {

    const confirmed = confirm(
      'A jeni i sigurt qe doni ta fshini kete oferte?'
    );

    if (!confirmed) {
      return;
    }

    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.loadOffers();
      },
      error: (error) => {
        console.error('Gabim ne fshirjen e ofertes:', error);
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
      oldPrice: null,
      newPrice: null,
      discount: null,
      image: ''
    };
  }

}