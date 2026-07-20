import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Hotel } from '../../../core/models/hotel.model';
import { APP_CONSTANTS } from '../../../core/config/app.constants';

@Component({
  selector: 'app-hotel-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hotel-card.component.html',
  styleUrl: './hotel-card.component.css'
})
export class HotelCardComponent {
  hotel = input.required<Hotel>();
  viewDetails = output<string>();

  getSoftGradient(name: string): string {
    const cleanName = name || '';
    const code1 = cleanName.charCodeAt(0) || 0;
    const code2 = (cleanName.charCodeAt(1) || 0) + (cleanName.charCodeAt(2) || 0);
    const h1 = (code1 * 7) % 360;
    const h2 = (code2 * 5) % 360;
    return `linear-gradient(135deg, hsl(${h1}, 80%, 94%) 0%, hsl(${h2}, 80%, 91%) 100%)`;
  }

  getHotelImage(name: string): string {
    const images = APP_CONSTANTS.UNSPLASH_PHOTO_IDS;
    
    let hash = 0;
    const cleanName = name || '';
    for (let i = 0; i < cleanName.length; i++) {
      hash = cleanName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % images.length;
    return `https://images.unsplash.com/${images[index]}?auto=format&fit=crop&w=500&q=80`;
  }

  getRatingClass(rating?: number): string {
    const r = rating || 0;
    if (r >= 8.5) return 'rating-excellent';
    if (r >= 7.0) return 'rating-good';
    return 'rating-average';
  }

  cleanStarRating(starRating?: string): string {
    return (starRating || '').replace(/hotel/i, '').trim();
  }

  getShortAddress(address?: string): string {
    const parts = (address || '').split(',');
    return parts[0]?.trim() || '';
  }

  getAmenities(amenities?: string): string[] {
    return (amenities || '').split('|').slice(0, 3).map(a => a.trim()).filter(a => a.length > 0);
  }

  onCardClick() {
    this.viewDetails.emit(this.hotel().uniqId);
  }
}
