import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './core/guards/auth.guard';
import { mainGuard } from './core/guards/main.guard';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Main Routes
  {
    path: 'home',
    component: HomeComponent,
    title: 'home',
    canActivate: [mainGuard],
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./pages/products/products.component').then(
        (c) => c.ProductsComponent,
      ),
    title: 'products',
    canActivate: [mainGuard],
  },
  {
    path: 'brands',
    loadComponent: () =>
      import('./pages/brands/brands.component').then((c) => c.BrandsComponent),
    title: 'brands',
    canActivate: [mainGuard],
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./pages/categories/categories.component').then(
        (c) => c.CategoriesComponent,
      ),
    title: 'categories',
    canActivate: [mainGuard],
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./pages/cart/cart.component').then((c) => c.CartComponent),
    title: 'cart',
    canActivate: [mainGuard],
  },
  {
    path: 'details/:id',
    loadComponent: () =>
      import('./pages/details/details.component').then(
        (c) => c.DetailsComponent,
      ),
    title: 'details',
    canActivate: [mainGuard],
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./pages/checkout/checkout.component').then(
        (c) => c.CheckoutComponent,
      ),
    title: 'checkout',
    canActivate: [mainGuard],
  },

  // Auth Routes
  {
    path: 'login',
    component: LoginComponent,
    title: 'login',
    canActivate: [authGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'register',
    canActivate: [authGuard],
  },
  {
    path: 'forgetPassword',
    component: ForgetPasswordComponent,
    title: 'forget password',
    canActivate: [authGuard],
  },

  // Not Found Route
  {
    path: '**',
    loadComponent: () =>
      import('./pages/notfound/notfound.component').then(
        (c) => c.NotfoundComponent,
      ),
    title: 'notfound',
  },
];
