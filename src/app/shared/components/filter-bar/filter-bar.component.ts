import { Component, EventEmitter, Output, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.css'
})
export class FilterBarComponent implements OnInit, OnDestroy {
  searchQuery = signal<string>('');
  selectedCity = signal<string>('');
  sortBy = signal<string>('averageRating');
  sortOrder = signal<string>('DESC');

  @Output() filterChanged = new EventEmitter<any>();
  @Output() addHotelTriggered = new EventEmitter<void>();

  private searchSubject = new Subject<string>();
  private searchSub?: Subscription;

  ngOnInit() {
    this.searchSub = this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(val => {
      this.searchQuery.set(val);
      this.onFiltersChanged();
    });
  }

  ngOnDestroy() {
    this.searchSub?.unsubscribe();
  }

  onSearchInput(val: string) {
    this.searchSubject.next(val);
  }

  onFiltersChanged() {
    this.filterChanged.emit({
      query: this.searchQuery(),
      city: this.selectedCity(),
      sortBy: this.sortBy(),
      sortOrder: this.sortOrder()
    });
  }

  onAddHotelClick() {
    this.addHotelTriggered.emit();
  }
}
