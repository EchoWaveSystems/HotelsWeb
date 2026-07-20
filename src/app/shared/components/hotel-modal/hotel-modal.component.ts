import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Hotel } from '../../../core/models/hotel.model';

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
