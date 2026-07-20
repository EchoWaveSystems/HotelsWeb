import { Component, OnInit, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GraphQLService } from '../../core/services/graphql.service';
import { AuthService } from '../../core/services/auth.service';
import { Hotel, CreateHotelInput } from '../../core/models/hotel.model';

import { HeaderComponent } from '../../shared/components/header/header.component';
import { FilterBarComponent } from '../../shared/components/filter-bar/filter-bar.component';
import { HotelCardComponent } from '../../shared/components/hotel-card/hotel-card.component';
import { HotelModalComponent } from '../../shared/components/hotel-modal/hotel-modal.component';
import { AddHotelModalComponent } from '../../shared/components/add-hotel-modal/add-hotel-modal.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FilterBarComponent,
    HotelCardComponent,
    HotelModalComponent,
    AddHotelModalComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  hotels = signal<Hotel[]>([]);
  filteredHotels = signal<Hotel[]>([]);
  loading = signal<boolean>(false);
  totalCount = signal<number>(0);
  pageSize = signal<number>(6);
  currentPage = signal<number>(1);
  
  city = signal<string>('');
  searchQuery = signal<string>('');
  sortBy = signal<string>('averageRating');
  sortOrder = signal<string>('DESC');
  errorMessage = signal<string>('');

  selectedHotel = signal<Hotel | null>(null);
  showDetailsModal = signal<boolean>(false);
  showAddModal = signal<boolean>(false);

  totalPages = computed(() => Math.ceil(this.totalCount() / this.pageSize()) || 1);

  constructor(
    private graphqlService: GraphQLService,
    private authService: AuthService,
    private router: Router
  ) {
    effect(() => {
      const query = this.searchQuery().toLowerCase();
      const items = this.hotels();
      if (!query) {
        this.filteredHotels.set(items);
      } else {
        this.filteredHotels.set(items.filter(h => h.name && h.name.toLowerCase().includes(query)));
      }
    });
  }

  ngOnInit() {
    this.loadHotels();
  }

  loadHotels() {
    this.loading.set(true);
    this.errorMessage.set('');
    
    const skip = (this.currentPage() - 1) * this.pageSize();
    
    this.graphqlService.getHotels(
      this.pageSize(),
      skip,
      this.city() || undefined,
      this.sortBy(),
      this.sortOrder()
    ).subscribe({
      next: (data) => {
        this.hotels.set(data?.items || []);
        this.totalCount.set(data?.totalCount || 0);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading hotels', err);
        this.errorMessage.set(this.extractErrorMessage(err));
        this.hotels.set([]);
        this.totalCount.set(0);
        this.loading.set(false);
      }
    });
  }

  onFilterChanged(filters: any) {
    let reloadNeeded = false;
    
    if (this.city() !== filters.city || this.sortBy() !== filters.sortBy || this.sortOrder() !== filters.sortOrder) {
      reloadNeeded = true;
    }

    this.city.set(filters.city);
    this.searchQuery.set(filters.query);
    this.sortBy.set(filters.sortBy);
    this.sortOrder.set(filters.sortOrder);

    if (reloadNeeded) {
      this.currentPage.set(1);
      this.loadHotels();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  onPageChange(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.loadHotels();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onViewDetails(uniqId: string) {
    this.selectedHotel.set(null);
    this.showDetailsModal.set(true);
    
    this.graphqlService.getHotel(uniqId).subscribe({
      next: (hotel) => {
        this.selectedHotel.set(hotel);
      },
      error: (err) => {
        console.error('Error loading hotel details', err);
        this.errorMessage.set(this.extractErrorMessage(err));
        this.showDetailsModal.set(false);
      }
    });
  }

  onAddHotelTriggered() {
    this.showAddModal.set(true);
  }

  onSaveHotel(hotelInput: CreateHotelInput) {
    this.graphqlService.createHotel(hotelInput).subscribe({
      next: () => {
        this.showAddModal.set(false);
        this.currentPage.set(1);
        this.loadHotels();
      },
      error: (err) => {
        console.error('Error creating hotel:', err);
        this.errorMessage.set(this.extractErrorMessage(err));
        this.showAddModal.set(false);
      }
    });
  }

  clearError() {
    this.errorMessage.set('');
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private extractErrorMessage(err: any): string {
    if (err?.error?.errors && Array.isArray(err.error.errors)) {
      return err.error.errors.map((e: any) => e.message).join(', ');
    }
    if (err?.message) {
      return err.message;
    }
    return 'An unknown error occurred.';
  }
}
