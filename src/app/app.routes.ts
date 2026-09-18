import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { OffersComponent } from './pages/offers/offers.component';
import { AboutComponent } from './pages/about/about.component';

import { authGuard } from './guards/auth.guard';

export const routes: Routes = [

  {
    path: '',
    component: HomeComponent
  },

  {
    path: 'products',
    component: ProductsComponent
  },

  {
    path: 'offers',
    component: OffersComponent
  },

  {
    path: 'about',
    component: AboutComponent
  },

  {
    path: 'stores',
    loadComponent: () =>
      import('./pages/stores/stores.component')
        .then(m => m.StoresComponent)
  },

  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact/contact.component')
        .then(m => m.ContactComponent)
  },

  // ADMIN LOGIN - nuk mbrohet me guard
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./pages/admin-login/admin-login.component')
        .then(m => m.AdminLoginComponent)
  },

  // ADMIN DASHBOARD
  {
    path: 'admin/dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/admin-dashboard/admin-dashboard.component')
        .then(m => m.AdminDashboardComponent)
  },

  // ADMIN OFFERS
  {
    path: 'admin/offers',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/admin-offers/admin-offers.component')
        .then(m => m.AdminOffersComponent)
  },

  // ADMIN PRODUCTS
  {
    path: 'admin/products',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/admin-products/admin-products.component')
        .then(m => m.AdminProductsComponent)
  },
// ADMIN CATALOG
{
  path: 'admin/catalog',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./pages/admin-catalog/admin-catalog.component')
      .then(m => m.AdminCatalogComponent)
},
// KATALOGU - publik
{
  path: 'catalog',
  loadComponent: () =>
    import('./pages/catalog/catalog.component')
      .then(m => m.CatalogComponent)
},
  // Nese shkruhet nje route qe nuk ekziston
  {
    path: '**',
    redirectTo: ''
  }

];