import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.css'
})
export class FilterBarComponent {
  searchQuery = signal<string>('');
  selectedCity = signal<string>('');
  sortBy = signal<string>('averageRating');
  sortOrder = signal<string>('DESC');

  @Output() filterChanged = new EventEmitter<any>();
  @Output() addHotelTriggered = new EventEmitter<void>();

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
