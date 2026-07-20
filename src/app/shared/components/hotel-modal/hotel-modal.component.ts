import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Hotel } from '../../../core/models/hotel.model';
import { APP_CONSTANTS } from '../../../core/config/app.constants';

@Component({
  selector: 'app-hotel-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hotel-modal.component.html',
  styleUrl: './hotel-modal.component.css'
})
export class HotelModalComponent {
  hotel = input<Hotel | null>(null);
  close = output<void>();
  isClosing = signal<boolean>(false);

  onClose() {
    this.isClosing.set(true);
    setTimeout(() => {
      this.close.emit();
    }, 250);
  }

  parseAmenities(amenities?: string): string[] {
    return (amenities || '').split('|').map(a => a.trim()).filter(a => a.length > 0);
  }

  getHotelImage(name?: string): string {
    const images = APP_CONSTANTS.UNSPLASH_PHOTO_IDS;
    
    let hash = 0;
    const cleanName = name || '';
    for (let i = 0; i < cleanName.length; i++) {
      hash = cleanName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % images.length;
    return `https://images.unsplash.com/${images[index]}?auto=format&fit=crop&w=800&q=80`;
  }

  getRatingVerdict(rating?: number): string {
    const r = rating || 0;
    if (r >= 9.0) return 'Superb';
    if (r >= 8.0) return 'Very Good';
    if (r >= 7.0) return 'Good';
    return 'Pleasant';
  }

  getSubRatings(h: Hotel): Array<{ label: string, value: number }> {
    return [
      { label: 'Cleanliness', value: h.cleanliness! },
      { label: 'Facilities', value: h.facilities! },
      { label: 'Location', value: h.location! },
      { label: 'Staff', value: h.staff! },
      { label: 'WiFi', value: h.wifi! },
      { label: 'Comfort', value: h.comfort! },
      { label: 'Value for Money', value: h.valueForMoney! }
    ].filter(r => r.value !== undefined && r.value !== null);
  }
}
