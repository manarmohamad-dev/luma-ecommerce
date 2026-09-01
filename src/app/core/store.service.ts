import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment';

export interface Product { id: string; title: string; price: number; category: string; image: string; description: string; rating: number; stock?: number; }
export interface CartItem { product: Product; quantity: number; }
export interface User { _id: string; name: string; email: string; role: 'user' | 'admin'; isBanned: boolean; }
interface ProductResponse extends Omit<Product, 'id'> { _id: string; }
interface ApiResponse<T> { success: boolean; data: T; message?: string; }

const API_URL = environment.apiUrl;
const TOKEN_KEY = 'luma-token';
const USER_KEY = 'luma-user';

@Injectable({ providedIn: 'root' })
export class StoreService {
  private readonly http = inject(HttpClient);
  readonly products = signal<Product[]>([]);
  readonly cart = signal<CartItem[]>([]);
  readonly favorites = signal<Product[]>([]);
  readonly user = signal<User | null>(this.readUser());
  readonly loading = signal(false);
  readonly error = signal('');
  readonly total = computed(() => this.cart().reduce((sum, item) => sum + item.product.price * item.quantity, 0));
  readonly isAuthenticated = computed(() => Boolean(this.token()));
  readonly isAdmin = computed(() => this.user()?.role === 'admin');

  constructor() { this.loadProducts(); if (this.token()) this.restoreSession(); }

  loadProducts() { this.http.get<ApiResponse<{ products: ProductResponse[] }>>(`${API_URL}/products`).subscribe({ next: (response) => this.products.set(response.data.products.map((product) => this.mapProduct(product))), error: () => this.error.set('تعذر تحميل المنتجات.') }); }
  product(id: string) { return this.products().find((product) => product.id === id); }
  isFavorite(productId: string) { return this.favorites().some((product) => product.id === productId); }

  login(email: string, password: string, done: (message?: string) => void) { this.authenticate('login', { email, password }, done); }
  register(name: string, email: string, password: string, done: (message?: string) => void) { this.authenticate('register', { name, email, password }, done); }
  logout() { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); this.user.set(null); this.favorites.set([]); this.cart.set([]); }

  addToCart(product: Product) { if (!this.isAuthenticated()) { this.error.set('سجّل الدخول لإضافة المنتجات إلى السلة.'); return false; } const item = this.cart().find((entry) => entry.product.id === product.id); this.saveCart(product, (item?.quantity || 0) + 1); return true; }
  changeQuantity(productId: string, quantity: number) { if (quantity < 1) return this.remove(productId); const item = this.cart().find((entry) => entry.product.id === productId); if (item) this.saveCart(item.product, quantity); }
  remove(productId: string) {
    this.http.delete<ApiResponse<CartItem[]>>(`${API_URL}/users/cart/${productId}`, { headers: this.headers() }).subscribe({ next: () => this.loadCart(), error: (error) => this.handleProtectedError(error) });
  }
  toggleFavorite(product: Product) {
    if (!this.isAuthenticated()) { this.error.set('سجّل الدخول لإضافة المنتجات إلى المفضلة.'); return; }
    this.http.post<ApiResponse<ProductResponse[]>>(`${API_URL}/users/favorites/${product.id}`, {}, { headers: this.headers() }).subscribe({ next: (response) => this.favorites.set(response.data.map((item) => this.mapProduct(item))), error: (error) => this.handleProtectedError(error) });
  }
  addProduct(product: Omit<Product, 'id' | 'rating'>, done: (message?: string) => void) {
    if (!this.isAdmin()) { done('هذه العملية متاحة للمدير فقط.'); return; }
    this.http.post<ApiResponse<ProductResponse>>(`${API_URL}/products`, product, { headers: this.headers() }).subscribe({ next: () => { this.loadProducts(); done(); }, error: (error) => { this.handleProtectedError(error); done(this.error()); } });
  }

  private authenticate(action: 'login' | 'register', body: object, done: (message?: string) => void) {
    this.loading.set(true); this.error.set('');
    this.http.post<{ success: boolean; token: string; user: User }>(`${API_URL}/auth/${action}`, body).subscribe({
      next: (response) => { this.setSession(response.token, response.user); done(); },
      error: (error) => { this.error.set(error.error?.message || 'تعذر إتمام العملية.'); done(this.error()); },
      complete: () => this.loading.set(false),
    });
  }
  private restoreSession() { this.http.get<ApiResponse<User>>(`${API_URL}/users/profile`, { headers: this.headers() }).subscribe({ next: (response) => { this.user.set(response.data); localStorage.setItem(USER_KEY, JSON.stringify(response.data)); this.loadCart(); this.loadFavorites(); }, error: (error) => this.handleProtectedError(error) }); }
  private setSession(token: string, user: User) { localStorage.setItem(TOKEN_KEY, token); localStorage.setItem(USER_KEY, JSON.stringify(user)); this.user.set(user); this.loadCart(); this.loadFavorites(); }
  private saveCart(product: Product, quantity: number) {
    this.http.put<ApiResponse<CartItem[]>>(`${API_URL}/users/cart`, { productId: product.id, quantity }, { headers: this.headers() }).subscribe({ next: () => this.loadCart(), error: (error) => this.handleProtectedError(error) });
  }
  private loadCart() { this.http.get<ApiResponse<Array<{ product: ProductResponse; quantity: number }>>>(`${API_URL}/users/cart`, { headers: this.headers() }).subscribe({ next: (response) => this.cart.set(response.data.filter((item) => item.product).map((item) => ({ product: this.mapProduct(item.product), quantity: item.quantity }))), error: (error) => this.handleProtectedError(error) }); }
  private loadFavorites() { this.http.get<ApiResponse<ProductResponse[]>>(`${API_URL}/users/favorites`, { headers: this.headers() }).subscribe({ next: (response) => this.favorites.set(response.data.map((item) => this.mapProduct(item))), error: (error) => this.handleProtectedError(error) }); }
  private token() { return localStorage.getItem(TOKEN_KEY); }
  private headers() { return new HttpHeaders({ Authorization: `Bearer ${this.token()}` }); }
  private mapProduct(product: ProductResponse): Product { const { _id, ...value } = product; return { ...value, id: _id }; }
  private readUser(): User | null { try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch { return null; } }
  private handleProtectedError(error: any) { this.error.set(error.error?.message || 'تعذر إتمام العملية.'); if (error.status === 401 || error.status === 403) this.logout(); }
}
