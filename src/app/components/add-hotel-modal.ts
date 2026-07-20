import { Component, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-hotel-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" [ngClass]="{'is-closing': isClosing}" (click)="onClose()">
      <div class="apple-glass modal-container" [ngClass]="{'is-closing': isClosing}" (click)="$event.stopPropagation()">
        <button class="close-btn" (click)="onClose()">✕</button>
        
        <div class="modal-content">
          <h2 class="form-title">Add New Hotel</h2>
          <p class="form-subtitle">Insert hotel details to register in database and broadcast Kafka notify events.</p>
          
          <form (submit)="onSubmit(); $event.preventDefault()">
            <!-- Form Grid -->
            <div class="form-grid">
              <div class="form-group full-width">
                <label for="name">Hotel Name *</label>
                <input type="text" id="name" name="name" [(ngModel)]="hotel.name" required placeholder="e.g. Grand Palace Inn" />
              </div>

              <div class="form-group">
                <label for="city">City *</label>
                <select id="city" name="city" [(ngModel)]="hotel.city" required>
                  <option value="" disabled selected>Select a city</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Bangalore">Bangalore</option>
                </select>
              </div>

              <div class="form-group">
                <label for="starRating">Star Rating</label>
                <select id="starRating" name="starRating" [(ngModel)]="hotel.hotelStarRating">
                  <option value=" 3-star hotel ">3 Stars</option>
                  <option value=" 4-star hotel ">4 Stars</option>
                  <option value=" 5-star hotel ">5 Stars</option>
                </select>
              </div>

              <div class="form-group full-width">
                <label for="address">Full Address</label>
                <input type="text" id="address" name="address" [(ngModel)]="hotel.address" placeholder="e.g. Sector-4, Safdarjung Enclave, Delhi" />
              </div>

              <div class="form-group">
                <label for="avgRating">Average Rating (1 - 10)</label>
                <input type="number" step="0.1" min="1" max="10" id="avgRating" name="avgRating" [(ngModel)]="hotel.averageRating" placeholder="e.g. 8.4" />
              </div>

              <div class="form-group">
                <label for="photoCount">Photo Count</label>
                <input type="number" min="0" id="photoCount" name="photoCount" [(ngModel)]="hotel.photoCount" placeholder="e.g. 24" />
              </div>

              <div class="form-group full-width">
                <label>Select Amenities</label>
                <div class="amenities-selection">
                  <label class="checkbox-label" *ngFor="let am of availableAmenities">
                    <input type="checkbox" [checked]="isChecked(am)" (change)="toggleAmenity(am)" />
                    <span>{{ am }}</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn-secondary" (click)="onClose()">Cancel</button>
              <button type="submit" class="btn-primary" [disabled]="submitting">
                <span *ngIf="!submitting">Create Hotel</span>
                <span *ngIf="submitting">Registering...</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.08);
      backdrop-filter: blur(12px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease-out;
    }

    .modal-overlay.is-closing {
      animation: fadeOut 0.25s ease-in forwards;
    }

    .modal-container {
      width: 90%;
      max-width: 580px;
      max-height: 85vh;
      overflow-y: auto;
      position: relative;
      background: rgba(255, 255, 255, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.6);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.05);
      border-radius: 24px;
      animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .modal-container.is-closing {
      animation: slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .close-btn {
      position: absolute;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.03);
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
      color: var(--text-primary);
      transition: all 0.2s ease;
    }

    .close-btn:hover {
      background: rgba(0, 0, 0, 0.06);
    }

    .modal-content {
      padding: 36px;
    }

    .form-title {
      font-family: var(--font-family-title);
      font-size: 1.6rem;
      font-weight: 700;
      letter-spacing: -0.020em;
      margin-bottom: 8px;
    }

    .form-subtitle {
      font-size: 0.88rem;
      color: var(--text-secondary);
      margin-bottom: 24px;
      line-height: 1.4;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .full-width {
      grid-column: span 2;
    }

    label {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-secondary);
    }

    input[type="text"], input[type="number"], select {
      background: rgba(0, 0, 0, 0.02);
      border: 1px solid rgba(0, 0, 0, 0.05);
      border-radius: 10px;
      padding: 10px 14px;
      font-size: 0.95rem;
      color: var(--text-primary);
      width: 100%;
      transition: all 0.2s ease;
    }

    input:focus, select:focus {
      background: #ffffff;
      border-color: var(--accent-color);
      box-shadow: 0 0 0 4px var(--accent-light);
    }

    /* Checkboxes */
    .amenities-selection {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      background: rgba(0, 0, 0, 0.01);
      border: 1px solid rgba(0, 0, 0, 0.03);
      padding: 14px;
      border-radius: 12px;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.85rem;
      color: var(--text-primary);
      cursor: pointer;
      font-weight: 400;
    }

    .checkbox-label input {
      accent-color: var(--accent-color);
      width: 16px;
      height: 16px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 32px;
      border-top: 1px solid var(--border-light);
      padding-top: 20px;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }

    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    @keyframes slideDown {
      from { transform: translateY(0); opacity: 1; }
      to { transform: translateY(20px); opacity: 0; }
    }
  `]
})
export class AddHotelModalComponent {
  submitting: boolean = false;
  hotel: any = {
    name: '',
    city: '',
    address: '',
    hotelStarRating: ' 3-star hotel ',
    averageRating: null,
    photoCount: null,
    amenities: ''
  };

  availableAmenities: string[] = [
    'Free WiFi',
    'Free parking',
    'Restaurant',
    'Room service',
    'Pool',
    'Gym',
    'Bar',
    'Air conditioning'
  ];

  selectedAmenities: Set<string> = new Set<string>();
  isClosing = false;

  constructor(private cdr: ChangeDetectorRef) {}

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  onClose() {
    this.isClosing = true;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.close.emit();
    }, 250);
  }

  isChecked(amenity: string): boolean {
    return this.selectedAmenities.has(amenity);
  }

  toggleAmenity(amenity: string) {
    if (this.selectedAmenities.has(amenity)) {
      this.selectedAmenities.delete(amenity);
    } else {
      this.selectedAmenities.add(amenity);
    }
    this.hotel.amenities = Array.from(this.selectedAmenities).join('|');
  }

  onSubmit() {
    if (!this.hotel.name || !this.hotel.city) return;
    this.submitting = true;
    this.save.emit(this.hotel);
  }
}
