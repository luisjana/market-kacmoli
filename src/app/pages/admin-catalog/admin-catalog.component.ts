import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar.component';

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
  selector: 'app-admin-catalog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    AdminSidebarComponent
  ],
  templateUrl: './admin-catalog.component.html',
  styleUrl: './admin-catalog.component.css'
})
export class AdminCatalogComponent implements OnInit {

  apiUrl = 'https://market-kacmoli-backend.onrender.com/api/catalog';

  catalogs: Catalog[] = [];
  loading = false;
  uploading = false;

  showForm = false;
  editingId: number | null = null;
  newTitle = '';
  selectedFiles: File[] = [];

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

  openAddForm(): void {
    this.editingId = null;
    this.newTitle = '';
    this.selectedFiles = [];
    this.showForm = true;
  }

  openEditForm(catalog: Catalog): void {
    this.editingId = catalog.id;
    this.newTitle = catalog.title;
    this.selectedFiles = [];
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.newTitle = '';
    this.selectedFiles = [];
    this.selectedFilePreviews = [];
  }

selectedFilePreviews: string[] = [];

onFilesSelected(event: Event): void {
  const input = event.target as HTMLInputElement;

  if (!input.files || input.files.length === 0) {
    return;
  }

  const newFiles = Array.from(input.files);

  this.selectedFiles = [...this.selectedFiles, ...newFiles];

  for (const file of newFiles) {
    const reader = new FileReader();
    reader.onload = () => {
      this.selectedFilePreviews.push(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  // pastro input-in qe te lejoje rizgjedhjen e te njejtit file
  input.value = '';
}

removeSelectedFile(index: number): void {
  this.selectedFiles.splice(index, 1);
  this.selectedFilePreviews.splice(index, 1);
}

  saveCatalog(): void {

    if (!this.newTitle) {
      return;
    }

    if (this.editingId === null && this.selectedFiles.length === 0) {
      return;
    }

    const formData = new FormData();
    formData.append('title', this.newTitle);

    for (const file of this.selectedFiles) {
      formData.append('files', file);
    }

    this.uploading = true;

    if (this.editingId !== null) {

      this.http.put<Catalog>(`${this.apiUrl}/${this.editingId}`, formData).subscribe({
        next: () => {
          this.uploading = false;
          this.closeForm();
          this.loadCatalogs();
        },
        error: (error) => {
          this.uploading = false;
          console.error('Gabim gjate editimit te katalogut:', error);
        }
      });

    } else {

      this.http.post<Catalog>(this.apiUrl, formData).subscribe({
        next: () => {
          this.uploading = false;
          this.closeForm();
          this.loadCatalogs();
        },
        error: (error) => {
          this.uploading = false;
          console.error('Gabim gjate shtimit te katalogut:', error);
        }
      });

    }
  }

  deleteCatalog(id: number): void {

    const confirmed = confirm(
      'A jeni i sigurt qe doni ta fshini kete katalog (me te gjitha fotot e tij)?'
    );

    if (!confirmed) {
      return;
    }

    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.loadCatalogs();
      },
      error: (error) => {
        console.error('Gabim ne fshirjen e katalogut:', error);
      }
    });
  }

  deleteImage(catalogId: number, imageId: number): void {

    const confirmed = confirm('A jeni i sigurt qe doni ta fshini kete foto?');

    if (!confirmed) {
      return;
    }

    this.http.delete(`${this.apiUrl}/${catalogId}/images/${imageId}`).subscribe({
      next: () => {
        this.loadCatalogs();
      },
      error: (error) => {
        console.error('Gabim ne fshirjen e fotos:', error);
      }
    });
  }

}