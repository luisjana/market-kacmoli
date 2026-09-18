import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    HttpClientModule
  ],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {

  email = '';
  password = '';

  errorMessage = '';

  private loginUrl = 'https://market-kacmoli-backend.onrender.com/api/auth/login';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  login(): void {

    this.errorMessage = '';

    const loginData = {
      email: this.email,
      password: this.password
    };

    this.http.post<any>(this.loginUrl, loginData).subscribe({

next: (response) => {

  localStorage.setItem('adminLoggedIn', 'true');
  localStorage.setItem('adminEmail', response.email);
  localStorage.setItem('adminId', response.adminId.toString());
  localStorage.setItem('token', response.token);

  this.router.navigate(['/admin/dashboard']);

},

      error: (error) => {

        console.error('Login error:', error);

        if (error.status === 401) {
          this.errorMessage = 'Email ose password i gabuar.';
        } else {
          this.errorMessage = 'Gabim ne lidhjen me serverin.';
        }

      }

    });

  }

}