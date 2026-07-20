import { Injectable, signal } from '@angular/core';
import { Observable, of, delay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'luxe_book_token';
  private readonly USER_KEY = 'luxe_book_user';

  isAuthenticated = signal<boolean>(this.hasToken());
  currentUser = signal<any | null>(this.getUserFromStorage());
  isLoading = signal<boolean>(false);

  login(email: string, password: string): Observable<any> {
    this.isLoading.set(true);
    // Simulate API delay
    return of({
      token: 'simulated-jwt-token-xyz-123',
      user: {
        email,
        name: email.split('@')[0],
        role: 'Admin',
        permissions: ['hotel:create', 'hotel:read']
      }
    }).pipe(
      delay(800),
      tap(res => {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
        
        this.currentUser.set(res.user);
        this.isAuthenticated.set(true);
        this.isLoading.set(false);
      })
    );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }

  private hasToken(): boolean {
    return typeof window !== 'undefined' ? !!localStorage.getItem(this.TOKEN_KEY) : false;
  }

  private getUserFromStorage(): any | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(this.USER_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
}
