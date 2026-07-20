import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="apple-glass filter-container">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input 
          type="text" 
          placeholder="Search by hotel name..." 
          [(ngModel)]="searchQuery"
          (input)="onFiltersChanged()"
        />
      </div>

      <div class="filter-controls">
        <div class="control-group">
          <label>City</label>
          <select [(ngModel)]="selectedCity" (change)="onFiltersChanged()">
            <option value="">All Cities</option>
            <option value="Delhi">Delhi</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Bangalore">Bangalore</option>
          </select>
        </div>

        <div class="control-group">
          <label>Sort By</label>
          <select [(ngModel)]="sortBy" (change)="onFiltersChanged()">
            <option value="averageRating">Average Rating</option>
            <option value="reviewCount">Review Count</option>
            <option value="name">Name</option>
          </select>
        </div>

        <div class="control-group">
          <label>Direction</label>
          <select [(ngModel)]="sortOrder" (change)="onFiltersChanged()">
            <option value="DESC">Descending</option>
            <option value="ASC">Ascending</option>
          </select>
        </div>
        
        <button class="btn-primary add-btn" (click)="onAddHotelClick()">
          <span>+ Add Hotel</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .filter-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 20px 24px;
      margin-bottom: 24px;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.45);
      border: 1px solid rgba(255, 255, 255, 0.5);
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.02);
      backdrop-filter: blur(20px) saturate(180%);
    }
    
    @media (min-width: 768px) {
      .filter-container {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }
    }

    .search-box {
      display: flex;
      align-items: center;
      background: rgba(0, 0, 0, 0.02);
      border: 1px solid rgba(0, 0, 0, 0.05);
      border-radius: 12px;
      padding: 10px 16px;
      gap: 10px;
      flex: 1;
      max-width: 400px;
      transition: all 0.2s ease;
    }

    .search-box:focus-within {
      background: #ffffff;
      border-color: var(--accent-color);
      box-shadow: 0 0 0 4px var(--accent-light);
    }

    .search-box input {
      border: none;
      background: transparent;
      font-size: 0.95rem;
      width: 100%;
      color: var(--text-primary);
    }

    .search-icon {
      font-size: 1rem;
      color: var(--text-secondary);
    }

    .filter-controls {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 16px;
    }

    .control-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .control-group label {
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .control-group select {
      background: rgba(0, 0, 0, 0.02);
      border: 1px solid rgba(0, 0, 0, 0.05);
      border-radius: 10px;
      padding: 8px 12px;
      font-size: 0.9rem;
      color: var(--text-primary);
      cursor: pointer;
      min-width: 130px;
      transition: all 0.2s ease;
    }

    .control-group select:hover {
      background: rgba(0, 0, 0, 0.05);
    }

    .add-btn {
      align-self: flex-end;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }
  `]
})
export class FilterBarComponent {
  searchQuery: string = '';
  selectedCity: string = '';
  sortBy: string = 'averageRating';
  sortOrder: string = 'DESC';

  @Output() filterChanged = new EventEmitter<any>();
  @Output() addHotelTriggered = new EventEmitter<void>();

  onFiltersChanged() {
    this.filterChanged.emit({
      query: this.searchQuery,
      city: this.selectedCity,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder
    });
  }

  onAddHotelClick() {
    this.addHotelTriggered.emit();
  }
}
