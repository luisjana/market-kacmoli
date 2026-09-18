import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    HttpClientModule
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {

  messageSent = false;
  sending = false;
  errorMessage = '';

  formData = {
    name: '',
    phone: '',
    email: '',
    message: ''
  };

  private formspreeUrl = 'https://formspree.io/f/myeylvod';

  constructor(private http: HttpClient) {}

  submitForm(): void {

    this.sending = true;
    this.errorMessage = '';
    this.messageSent = false;

    this.http.post(
      this.formspreeUrl,
      this.formData,
      {
        headers: {
          Accept: 'application/json'
        }
      }
    ).subscribe({

      next: () => {

        this.messageSent = true;
        this.sending = false;

        this.formData = {
          name: '',
          phone: '',
          email: '',
          message: ''
        };

        setTimeout(() => {
          this.messageSent = false;
        }, 5000);

      },

      error: () => {

        this.sending = false;

        this.errorMessage =
          'Mesazhi nuk u dergua. Ju lutem provoni perseri.';

      }

    });

  }

}