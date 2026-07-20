import { Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateHotelInput } from '../../../core/models/hotel.model';

@Component({
  selector: 'app-add-hotel-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-hotel-modal.component.html',
  styleUrl: './add-hotel-modal.component.css'
})
export class AddHotelModalComponent {
  submitting = signal<boolean>(false);
  isClosing = signal<boolean>(false);

  hotel = signal<CreateHotelInput>({
    name: '',
    city: '',
    address: '',
    hotelStarRating: ' 3-star hotel ',
    averageRating: undefined,
    photoCount: undefined,
    amenities: ''
  });

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

  selectedAmenities = signal<Set<string>>(new Set<string>());

  save = output<CreateHotelInput>();
  close = output<void>();

  onClose() {
    this.isClosing.set(true);
    setTimeout(() => {
      this.close.emit();
    }, 250);
  }

  isChecked(amenity: string): boolean {
    return this.selectedAmenities().has(amenity);
  }

  toggleAmenity(amenity: string) {
    const current = new Set(this.selectedAmenities());
    if (current.has(amenity)) {
      current.delete(amenity);
    } else {
      current.add(amenity);
    }
    this.selectedAmenities.set(current);
    
    this.hotel.update(h => ({
      ...h,
      amenities: Array.from(current).join('|')
    }));
  }

  onSubmit() {
    const data = this.hotel();
    if (!data.name || !data.city) return;
    this.submitting.set(true);
    this.save.emit(data);
  }
}
