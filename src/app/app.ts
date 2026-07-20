import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphQLService } from './services/graphql.service';
import { HeaderComponent } from './components/header';
import { FilterBarComponent } from './components/filter-bar';
import { HotelCardComponent } from './components/hotel-card';
import { HotelModalComponent } from './components/hotel-modal';
import { AddHotelModalComponent } from './components/add-hotel-modal';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FilterBarComponent,
    HotelCardComponent,
    HotelModalComponent,
    AddHotelModalComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  hotels: any[] = [];
  filteredHotels: any[] = [];
  loading: boolean = false;
  totalCount: number = 0;
  pageSize: number = 6;
  currentPage: number = 1;
  
  city: string = '';
  searchQuery: string = '';
  sortBy: string = 'averageRating';
  sortOrder: string = 'DESC';

  selectedHotel: any = null;
  showDetailsModal: boolean = false;
  showAddModal: boolean = false;
  errorMessage: string = '';

  constructor(private graphqlService: GraphQLService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadHotels();
  }

  loadHotels() {
    this.loading = true;
    this.errorMessage = '';
    const skip = (this.currentPage - 1) * this.pageSize;
    
    this.graphqlService.getHotels(this.pageSize, skip, this.city, this.sortBy, this.sortOrder).subscribe({
      next: (data) => {
        this.hotels = data?.items || [];
        this.totalCount = data?.totalCount || 0;
        this.applyClientSideFilters();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading hotels', err);
        this.errorMessage = this.extractErrorMessage(err);
        this.hotels = [];
        this.filteredHotels = [];
        this.totalCount = 0;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  clearError() {
    this.errorMessage = '';
    this.cdr.detectChanges();
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

  applyClientSideFilters() {
    if (!this.searchQuery) {
      this.filteredHotels = this.hotels;
    } else {
      const q = this.searchQuery.toLowerCase();
      this.filteredHotels = this.hotels.filter(h => h.name && h.name.toLowerCase().includes(q));
    }
  }

  onFilterChanged(filters: any) {
    let reloadNeeded = false;
    
    if (this.city !== filters.city || this.sortBy !== filters.sortBy || this.sortOrder !== filters.sortOrder) {
      reloadNeeded = true;
    }

    this.city = filters.city;
    this.searchQuery = filters.query;
    this.sortBy = filters.sortBy;
    this.sortOrder = filters.sortOrder;

    if (reloadNeeded) {
      this.currentPage = 1;
      this.loadHotels();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      this.applyClientSideFilters();
      this.cdr.detectChanges();
    }
  }

  onPageChange(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadHotels();
    
    // Smooth scroll to top of window on page navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize) || 1;
  }

  onViewDetails(uniqId: string) {
    this.selectedHotel = null;
    this.showDetailsModal = true;
    this.cdr.detectChanges();
    
    this.graphqlService.getHotel(uniqId).subscribe({
      next: (hotel) => {
        this.selectedHotel = hotel;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading hotel details', err);
        this.errorMessage = this.extractErrorMessage(err);
        this.showDetailsModal = false; // Hide the loading modal if call fails
        this.cdr.detectChanges();
      }
    });
  }

  onAddHotelTriggered() {
    this.showAddModal = true;
    this.cdr.detectChanges();
  }

  onSaveHotel(hotelInput: any) {
    this.graphqlService.createHotel(hotelInput).subscribe({
      next: (res) => {
        this.showAddModal = false;
        this.currentPage = 1;
        this.loadHotels();
      },
      error: (err) => {
        console.error('Error creating hotel:', err);
        this.errorMessage = this.extractErrorMessage(err);
        this.showAddModal = false;
        this.cdr.detectChanges();
      }
    });
  }
}
