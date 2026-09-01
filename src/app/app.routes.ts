import { Routes } from '@angular/router';
import { AdminComponent, CartComponent, FavoritesComponent, HomeComponent, LoginComponent, NotFoundComponent, ProductDetailsComponent, ProductFormComponent, ProductsComponent, RegisterComponent } from './pages/pages';
import { adminGuard } from './core/admin.guard';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'الرئيسية | متجر Angular' },
  { path: 'products', component: ProductsComponent, title: 'المنتجات' },
  { path: 'products/:id', component: ProductDetailsComponent, title: 'تفاصيل المنتج' },
  { path: 'cart', component: CartComponent, canActivate: [authGuard], title: 'السلة' },
  { path: 'favorites', component: FavoritesComponent, canActivate: [authGuard], title: 'المفضلة' },
  { path: 'login', component: LoginComponent, title: 'تسجيل الدخول' },
  { path: 'register', component: RegisterComponent, title: 'إنشاء حساب' },
  { path: 'admin', component: AdminComponent, canActivate: [adminGuard], title: 'لوحة التحكم' },
  { path: 'admin/products/new', component: ProductFormComponent, canActivate: [adminGuard], title: 'إضافة منتج' },
  { path: '**', component: NotFoundComponent, title: 'الصفحة غير موجودة' },
];
