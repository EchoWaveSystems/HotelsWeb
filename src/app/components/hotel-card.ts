import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hotel-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="apple-glass-interactive card-container" (click)="onCardClick()">
      <!-- Card Image (Soft Apple pastels gradient mesh background fallback) -->
      <div class="card-image-placeholder" [ngStyle]="{'background': getSoftGradient(hotel.name)}">
        <img [src]="getHotelImage(hotel.name)" class="card-image" alt="Hotel Photo" />
        <div class="star-rating-badge" *ngIf="hotel.hotelStarRating">
          {{ cleanStarRating(hotel.hotelStarRating) }}
        </div>
      </div>
      
      <!-- Card Body -->
      <div class="card-body">
        <div class="card-header">
          <h3 class="card-title">{{ hotel.name }}</h3>
          <div class="rating-badge" [ngClass]="getRatingClass(hotel.averageRating)">
            {{ hotel.averageRating?.toFixed(1) || 'N/A' }}
          </div>
        </div>
        
        <p class="card-location">📍 {{ hotel.city }}<span *ngIf="hotel.address"> — {{ getShortAddress(hotel.address) }}</span></p>
        
        <!-- Amenities List (First 3) -->
        <div class="amenities-tags" *ngIf="hotel.amenities">
          <span class="amenity-tag" *ngFor="let tag of getAmenities(hotel.amenities)">
            {{ tag }}
          </span>
        </div>
        
        <div class="card-footer">
          <span class="reviews-count" *ngIf="hotel.reviewCount">{{ hotel.reviewCount }} reviews</span>
          <span class="details-link">View details ➔</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card-container {
      display: flex;
      flex-direction: column;
      height: 380px;
      overflow: hidden;
      cursor: pointer;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.45);
      border: 1px solid rgba(255, 255, 255, 0.5);
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.02);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .card-container:hover {
      background: rgba(255, 255, 255, 0.65);
      box-shadow: 0 12px 48px 0 rgba(31, 38, 135, 0.05);
      transform: translateY(-4px);
    }

    .card-image-placeholder {
      height: 160px;
      width: 100%;
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .card-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .card-container:hover .card-image {
      transform: scale(1.06);
    }

    .star-rating-badge {
      position: absolute;
      bottom: 12px;
      left: 16px;
      background: rgba(255, 255, 255, 0.75);
      backdrop-filter: blur(8px);
      padding: 4px 10px;
      border-radius: 980px;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-primary);
      border: 1px solid rgba(255, 255, 255, 0.5);
      z-index: 2;
    }

    .card-body {
      padding: 18px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 8px;
    }

    .card-title {
      font-family: var(--font-family-title);
      font-size: 1.15rem;
      font-weight: 600;
      letter-spacing: -0.015em;
      line-height: 1.25;
      color: var(--text-primary);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .rating-badge {
      padding: 4px 10px;
      font-size: 0.85rem;
      font-weight: 700;
      border-radius: 8px;
      text-align: center;
      min-width: 38px;
    }

    .rating-excellent {
      background: #e6f7ed;
      color: #2e7d32;
    }
    .rating-good {
      background: #eef2ff;
      color: #3f51b5;
    }
    .rating-average {
      background: #fff8e1;
      color: #f57f17;
    }

    .card-location {
      font-size: 0.82rem;
      color: var(--text-secondary);
      margin-bottom: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .amenities-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: auto;
    }

    .amenity-tag {
      background: rgba(0, 0, 0, 0.03);
      border: 1px solid rgba(0, 0, 0, 0.03);
      font-size: 0.72rem;
      color: var(--text-secondary);
      padding: 4px 8px;
      border-radius: 6px;
      font-weight: 500;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 14px;
      padding-top: 12px;
      border-top: 1px solid var(--border-light);
    }

    .reviews-count {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .details-link {
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--accent-color);
    }
  `]
})
export class HotelCardComponent {
  @Input() hotel: any;
  @Output() viewDetails = new EventEmitter<string>();

  getSoftGradient(name: string): string {
    const code1 = name.charCodeAt(0) || 0;
    const code2 = (name.charCodeAt(1) || 0) + (name.charCodeAt(2) || 0);
    const h1 = (code1 * 7) % 360;
    const h2 = (code2 * 5) % 360;
    return `linear-gradient(135deg, hsl(${h1}, 80%, 94%) 0%, hsl(${h2}, 80%, 91%) 100%)`;
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
    return `https://images.unsplash.com/${images[index]}?auto=format&fit=crop&w=500&q=80`;
  }

  getRatingClass(rating: number): string {
    if (rating >= 8.5) return 'rating-excellent';
    if (rating >= 7.0) return 'rating-good';
    return 'rating-average';
  }

  cleanStarRating(starRating: string): string {
    return starRating.replace(/hotel/i, '').trim();
  }

  getShortAddress(address: string): string {
    const parts = address.split(',');
    return parts[0].trim();
  }

  getAmenities(amenities: string): string[] {
    return amenities.split('|').slice(0, 3).map(a => a.trim());
  }

  onCardClick() {
    this.viewDetails.emit(this.hotel.uniqId);
  }
}
