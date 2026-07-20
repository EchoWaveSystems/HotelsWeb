import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hotel-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" [ngClass]="{'is-closing': isClosing}" (click)="onClose()">
      <div class="apple-glass modal-container" [ngClass]="{'is-closing': isClosing}" (click)="$event.stopPropagation()">
        <!-- Close Button -->
        <button class="close-btn" (click)="onClose()">✕</button>
        
        <div class="modal-content" *ngIf="hotel; else loading">
          <!-- Modal Hero Image -->
          <div class="modal-hero-container">
            <img [src]="getHotelImage(hotel.name)" class="modal-hero-image" alt="Hotel Hero" />
          </div>
          
          <div class="modal-header">
            <span class="hotel-type-badge">{{ hotel.hotelType || 'Hotel' }}</span>
            <h2 class="hotel-name">{{ hotel.name }}</h2>
            <p class="hotel-address">📍 {{ hotel.address }}</p>
            <div class="header-stats">
              <span class="star-rating" *ngIf="hotel.hotelStarRating">⭐ {{ hotel.hotelStarRating }}</span>
              <span class="review-count" *ngIf="hotel.reviewCount">Based on {{ hotel.reviewCount }} reviews</span>
            </div>
          </div>

          <div class="modal-body-grid">
            <!-- Left Panel: Info & Amenities -->
            <div class="details-left">
              <div class="info-section">
                <h4>About</h4>
                <p>This property is located in the <strong>{{ hotel.area || hotel.city }}</strong> area.</p>
                <div class="location-links">
                  <a *ngIf="hotel.lat && hotel.long" [href]="'https://www.google.com/maps/search/?api=1&query=' + hotel.lat + ',' + hotel.long" target="_blank" class="map-link">
                    📍 View Co-ordinates ➔
                  </a>
                  <a [href]="hotel.pageUrl" target="_blank" class="booking-link">
                    🌐 View on Booking.com ➔
                  </a>
                </div>
              </div>

              <div class="amenities-section" *ngIf="hotel.amenities">
                <h4>Amenities</h4>
                <div class="amenities-list">
                  <span class="amenity-badge" *ngFor="let item of parseAmenities(hotel.amenities)">
                    {{ item }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Right Panel: Ratings Breakdown -->
            <div class="details-right">
              <div class="score-card">
                <div class="main-score">
                  <span class="score-num">{{ hotel.averageRating?.toFixed(1) || 'N/A' }}</span>
                  <div class="score-label">
                    <span class="score-text">{{ getRatingVerdict(hotel.averageRating) }}</span>
                    <span class="score-photos">📸 {{ hotel.photoCount || 0 }} photos</span>
                  </div>
                </div>
              </div>

              <!-- Sub-ratings progress bars -->
              <div class="sub-ratings-list">
                <h4>Ratings breakdown</h4>
                
                <div class="rating-row" *ngFor="let item of getSubRatings(hotel)">
                  <div class="rating-info">
                    <span class="rating-label">{{ item.label }}</span>
                    <span class="rating-val">{{ item.value?.toFixed(1) || 'N/A' }}</span>
                  </div>
                  <div class="progress-track">
                    <div class="progress-bar" [style.width.%]="(item.value || 0) * 10"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <ng-template #loading>
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading hotel details...</p>
          </div>
        </ng-template>
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
      max-width: 820px;
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

    .modal-hero-container {
      width: 100%;
      height: 220px;
      border-radius: 16px;
      overflow: hidden;
      margin-bottom: 24px;
      border: 1px solid rgba(255, 255, 255, 0.4);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
    }

    .modal-hero-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .modal-header {
      margin-bottom: 24px;
      border-bottom: 1px solid var(--border-light);
      padding-bottom: 20px;
    }

    .hotel-type-badge {
      display: inline-block;
      background: var(--accent-light);
      color: var(--accent-color);
      font-size: 0.75rem;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 6px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 8px;
    }

    .hotel-name {
      font-family: var(--font-family-title);
      font-size: 1.8rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin-bottom: 8px;
    }

    .hotel-address {
      font-size: 0.9rem;
      color: var(--text-secondary);
      margin-bottom: 12px;
    }

    .header-stats {
      display: flex;
      gap: 16px;
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    .modal-body-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 32px;
    }

    @media (min-width: 768px) {
      .modal-body-grid {
        grid-template-columns: 1.2fr 1fr;
      }
    }

    h4 {
      font-family: var(--font-family-title);
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 12px;
      text-transform: capitalize;
    }

    .info-section {
      margin-bottom: 24px;
    }

    .info-section p {
      font-size: 0.92rem;
      line-height: 1.6;
      color: var(--text-primary);
      margin-bottom: 12px;
    }

    .location-links {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 14px;
    }

    .booking-link, .map-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.88rem;
      font-weight: 600;
      text-decoration: none;
      width: fit-content;
    }

    .booking-link {
      color: var(--accent-color);
    }

    .booking-link:hover {
      text-decoration: underline;
    }

    .map-link {
      color: #34c759; /* Apple Green */
    }

    .map-link:hover {
      text-decoration: underline;
    }

    .amenities-list {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .amenity-badge {
      background: rgba(0, 0, 0, 0.01);
      border: 1px solid rgba(0, 0, 0, 0.03);
      color: var(--text-secondary);
      font-size: 0.78rem;
      padding: 6px 12px;
      border-radius: 8px;
      font-weight: 500;
    }

    /* Right Panel Scores */
    .score-card {
      background: rgba(0, 0, 0, 0.01);
      border: 1px solid rgba(0, 0, 0, 0.02);
      padding: 16px;
      border-radius: 16px;
      margin-bottom: 24px;
    }

    .main-score {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .score-num {
      background: var(--accent-color);
      color: #ffffff;
      font-size: 1.8rem;
      font-weight: 700;
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .score-label {
      display: flex;
      flex-direction: column;
    }

    .score-text {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .score-photos {
      font-size: 0.8rem;
      color: var(--text-secondary);
    }

    .sub-ratings-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .rating-row {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .rating-info {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .rating-label {
      color: var(--text-secondary);
    }

    .rating-val {
      color: var(--text-primary);
      font-weight: 600;
    }

    .progress-track {
      background: rgba(0, 0, 0, 0.03);
      height: 6px;
      border-radius: 99px;
      overflow: hidden;
      width: 100%;
    }

    .progress-bar {
      background: var(--accent-color);
      height: 100%;
      border-radius: 99px;
    }

    .loading-state {
      padding: 60px;
      text-align: center;
      color: var(--text-secondary);
    }

    .spinner {
      border: 3px solid rgba(0, 0, 0, 0.03);
      border-top: 3px solid var(--accent-color);
      border-radius: 50%;
      width: 32px;
      height: 32px;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 16px;
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

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class HotelModalComponent {
  @Input() hotel: any;
  @Output() close = new EventEmitter<void>();
  isClosing = false;

  constructor(private cdr: ChangeDetectorRef) { }

  onClose() {
    this.isClosing = true;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.close.emit();
    }, 250);
  }

  parseAmenities(amenities: string): string[] {
    return amenities.split('|').map(a => a.trim()).filter(a => a.length > 0);
  }

  getHotelImage(name: string): string {
    const images = [
      'photo-1566073771259-6a8506099945', 'photo-1582719508461-905c673771fd',
      'photo-1520250497591-112f2f40a3f4', 'photo-1542314831-068cd1dbfeeb',
      'photo-1445019980597-93fa8acb246c', 'photo-1571896349842-33c89424de2d',
      'photo-1590490360182-c33d57733427', 'photo-1551882547-ff40c63fe5fa',
      'photo-1517840901100-8179e982acb7', 'photo-1578683010236-d716f9a3f461',
      'photo-1564507592333-c60657eea523', 'photo-1568495248636-6432b97bd949',
      'photo-1535827841776-24afc1e255ac', 'photo-1506059612708-99d6c258160e',
      'photo-1512917774080-9991f1c4c750', 'photo-1618773928121-c32242e63f39',
      'photo-1518780664697-55e3ad937233', 'photo-1529290130-4ca3753253ae',
      'photo-1504624268003-6d85c797b29a', 'photo-1554080353-a576cf803bda',
      'photo-1584132967334-10e028bd69f7', 'photo-1606046604972-77cc76aee944',
      'photo-1540555700478-4be289fbecef',
      'photo-1549294413-26f195afcbce', 'photo-1576013551627-0cc20b96c2a7',
      'photo-1522771739844-6a9f6d5f14af', 'photo-1502672260266-1c1ef2d93688',
      'photo-1560448204-e02f11c3d0e2', 'photo-1556911220-e15b29be8c8f',
      'photo-1484154218962-a197022b5858', 'photo-1585412727339-54e4bae3bbf9',
      'photo-1493809842364-78817add7ffb', 'photo-1505691938895-1758d7feb511',
      'photo-1499955085172-a104c9463ece', 'photo-1507089947368-19c1da9775ae',
      'photo-1501183007986-d0d080b147f9', 'photo-1513694203232-719a280e022f',
      'photo-1486406146926-c627a92ad1ab', 'photo-1497366216548-37526070297c',
      'photo-1497215728101-856f4ea42174', 'photo-1497366811353-6870744d04b2',
      'photo-1504384308090-c894fdcc538d', 'photo-1564013799919-ab600027ffc6',
      'photo-1600585154340-be6161a56a0c', 'photo-1600596542815-ffad4c1539a9',
      'photo-1600607687939-ce8a6c25118c', 'photo-1600566753376-12c8ab7fb75b',
      'photo-1600585154526-990dced4db0d', 'photo-1600210492486-724fe5c67fb0'
    ];

    let hash = 0;
    const cleanName = name || '';
    for (let i = 0; i < cleanName.length; i++) {
      hash = cleanName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % images.length;
    return `https://images.unsplash.com/${images[index]}?auto=format&fit=crop&w=800&q=80`;
  }

  getRatingVerdict(rating: number): string {
    if (rating >= 9.0) return 'Superb';
    if (rating >= 8.0) return 'Very Good';
    if (rating >= 7.0) return 'Good';
    return 'Pleasant';
  }

  getSubRatings(hotel: any): Array<{ label: string, value: number }> {
    return [
      { label: 'Cleanliness', value: hotel.cleanliness },
      { label: 'Facilities', value: hotel.facilities },
      { label: 'Location', value: hotel.location },
      { label: 'Staff', value: hotel.staff },
      { label: 'WiFi', value: hotel.wifi },
      { label: 'Comfort', value: hotel.comfort },
      { label: 'Value for Money', value: hotel.valueForMoney }
    ].filter(r => r.value !== undefined && r.value !== null);
  }
}
